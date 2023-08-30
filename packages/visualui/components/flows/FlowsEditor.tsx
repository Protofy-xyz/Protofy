import React, { useState, useEffect, useContext, useRef } from 'react'
import { FlowFactory } from '../flowslib';
import {
  Box, Button,
  Menu, Pressable, Icon, IconButton, Input, VStack, HStack,
  WarningOutlineIcon, FormControl, Flex, Modal, Text
} from 'native-base';
import { useFlowsStore, FlowStoreContext, BaseJSMasks } from '../flowslib';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Monaco from '../Monaco';
import useKeypress from 'react-use-keypress';
import 'react-chat-widget/lib/styles.css';
import { useRouter } from 'next/router';
import CustomComponents from './nodes';
import { useDeviceStore } from '../../store/DeviceStore';
import { useAppStore } from '../../../../context/appStore';
import dynamic from 'next/dynamic'
import UIMasks from './masks/UI.mask.json'

var AIAssistant = <></>
AIAssistant = dynamic(() => import('./AIAssistant'), {
  ssr: false
})

const flowStore = useFlowsStore()

const SPLITCODEEDITOR = false

const postData = async (url = "", data = {}) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
const Flow = FlowFactory('flows')
const DEFAULT_FLOW = "api.ts"

const FlowSelector = ({ flows, currentFlow, onSelectFlow, onSubmitNewFlow, onDeleteFlow }: any) => {
  const [newFlowName, setNewFlowName] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [flowHovered, setFlowHovered] = useState()
  const handleChange = (text) => setNewFlowName(text)

  const flowNameValidator = (name: string) => {
    let isValid = true;
    if (name.includes(' ')) { // cannot contain spaces
      isValid = false
    }
    const extension = name.split('.')[1] ?? '';
    if (extension && extension != 'ts') {
      isValid = false
    }
    return isValid
  }

  const triggerErrorMsg = (errMsg: string) => {
    setErrorMsg(errMsg)
    setTimeout(() => { // Show error for 5s
      setErrorMsg("");
    }, 5000);
  }
  const onSubmit = async () => {
    setErrorMsg("")// reset error
    if (!flowNameValidator(newFlowName)) {
      triggerErrorMsg(`Name not valid`)
    }
    else {
      try {
        await onSubmitNewFlow(newFlowName)
        setNewFlowName("")
      } catch (e) {
        if (e.errorType === 500) {
          triggerErrorMsg(`"${newFlowName}" exists`)
        }
      }
    }
  }
  const removeFileExtension = (f) => f?.split('.')[0] ?? f

  return (
    <Box position="absolute" top="40px" right="40px">
      <Menu w="190" placement="bottom right"
        onClose={() => setNewFlowName('')}
        trigger={triggerProps => {
          return <Pressable accessibilityLabel="More options menu" {...triggerProps} flexDir='row' alignItems='center'>
            <HStack>
              <Text fontSize="md" fontWeight='light'>Flow: </Text><Text fontSize="md" fontWeight='medium'>{removeFileExtension(currentFlow)}</Text>
            </HStack>
            <Icon as={MaterialCommunityIcons} ml='10px' pt="1px" name={'chevron-down'} size='md' />
          </Pressable>;
        }}>
        {
          flows?.length ? flows?.map((flow, index) => {
            return <Menu.Item
              onPress={() => onSelectFlow(flow)}
              key={index}
              onMouseEnter={() => setFlowHovered(flow)}
              onMouseLeave={() => setFlowHovered()}
            >
              <Flex
                flexDir="row"
                alignItems="center"
                w="100%"
              >
                <Text flex={1}>
                  {removeFileExtension(flow)}
                </Text>
                {
                  flowHovered == flow ?
                    <IconButton size="xs" color="warmGray.300" _icon={{ as: MaterialCommunityIcons, name: 'close' }} onPress={() => {
                      onDeleteFlow(flow);
                    }} />
                    : <></>
                }
              </Flex>
            </Menu.Item>
          }) : null}
        <Menu.Item >
          <FormControl isInvalid={!!errorMsg} w="75%">
            <Input zIndex={100} variant="underlined" onClick={(e) => e.stopPropagation()} onChangeText={handleChange} value={newFlowName} placeholder="New flow" onSubmitEditing={async () => await onSubmit()} />
            <FormControl.ErrorMessage position="relative" leftIcon={<WarningOutlineIcon size="xs" />}>
              {errorMsg}
            </FormControl.ErrorMessage>
          </FormControl>
          <IconButton p="5px" borderRadius='10px' variant='solid' _icon={{ as: MaterialCommunityIcons, name: 'plus' }} isDisabled={!newFlowName} onPress={async () => await onSubmit()} />
        </Menu.Item>
      </Menu>
    </Box>
  )
}

const FlowDeleteModal = ({ flowToDelete, onDismiss, onConfirm }) => {
  return (
    <Modal isOpen={!!flowToDelete} onClose={onDismiss}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Body>
          <Text>{`Are you sure you want to delete "${flowToDelete}" flow?`}</Text>
          <Button.Group space={2} mt="6">
            <Button variant="ghost" colorScheme="blueGray" onPress={onDismiss}>
              Cancel
            </Button>
            <Button onPress={onConfirm}>
              Delete
            </Button>
          </Button.Group>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  )
}

const FlowsScreen = ({ isActive }) => {
  const useFlowsStore = useContext(FlowStoreContext)
  const setSaveStatus = useFlowsStore(state => state.setSaveStatus)
  const editorRef = useRef()
  const mqttPub = useAppStore(state => state.mqttPub)
  const [sourceCode, setSourceCode] = useState('')
  const [tmpMonacoCode, setTmpMonacoCode] = useState('')
  const [selectedCode, setSelectedCode] = useState<string>('')
  const [positions, setPositions] = useState()
  const [visibleCode, setVisibleCode] = useState(false)
  const [ready, setReady] = useState(false)
  const [flows, setFlows] = useState([])
  const [currentFlow, setCurrentFlow] = useState(DEFAULT_FLOW)
  const [deleteModal, setDeleteModal] = useState()
  const router = useRouter()
  const devicesList = useDeviceStore(state => state.devicesList)
  const [customComponents, setCustomComponents] = useState([])

  const loadContentFromCurrentFlow = async () => {
    try {
      const response = await fetch(`/api/v1/flows/cloudapi/${currentFlow}/read`)
      const jsonData = await response.json()
      setPositions(JSON.parse(jsonData.positions))
      setSourceCode(jsonData.config)
      setTmpMonacoCode(jsonData.config)
      setReady(true)
    } catch (e) { console.error(e) }
  }

  const loadContentFromFilename = async () => {
    try {
      const filename = router.query.filename;
      const response = await fetch('/api/v1/flows/read?filename=' + filename)
      const jsonData = await response.json()
      setPositions(JSON.parse(jsonData.positions))
      setSourceCode(jsonData.config)
      setTmpMonacoCode(jsonData.config)
      setReady(true)
    } catch (e) { console.error(e) }
  }

  const onReload = async () => {
    setSourceCode('');
    setTmpMonacoCode('');
    await loadContent()
  }

  const loadContent = async () => {
    if (router.query?.filename) {
      await loadContentFromFilename();
    } else {
      await loadContentFromCurrentFlow()
    }
  }

  const listFlows = async () => {
    try {
      const response = await fetch('/api/v1/flows/cloudapi/listFlows')
      const jsonData = await response.json()
      const availableFlows = jsonData.flows
      setFlows(availableFlows)
    } catch (e) {
      console.error('Error fetching flows')
    }
  }

  useEffect(() => {
    loadContent()
  }, [currentFlow, router])

  useEffect(() => {
    listFlows()
  }, [])

  const onSaveFlowsFromCurrentFlow = async (code, positions) => {
    setSaveStatus('loading')
    try {
      await postData("/api/v1/flows/cloudapi", { code: code, positions: positions, filename: currentFlow })
      setSaveStatus(null)
      setSourceCode(code)
      setTmpMonacoCode(code)
    } catch (e) { console.error(e); setSaveStatus('error') }
  }

  const onSaveFlowsFromFilename = async (code, positions) => {
    setSaveStatus('loading')
    try {
      const filename = router.query.filename;
      await postData("/api/v1/flows/update", { code: code, positions: positions, filename: filename })
      setSaveStatus(null)
      setSourceCode(code)
      setTmpMonacoCode(code)
    } catch (e) { console.error(e); setSaveStatus('error') }
  }

  const onSaveFlows = async (code, positions) => {
    if (router.query?.filename) {
      await onSaveFlowsFromFilename(code, positions);
    } else {
      await onSaveFlowsFromCurrentFlow(code, positions)
    }
  }

  const onMonacoChange = (str) => {
    if (SPLITCODEEDITOR) {
      setSourceCode(str)
    } else {
      setTmpMonacoCode(str)
    }
  }
  const onSaveMonaco = () => {
    onSaveFlows(tmpMonacoCode, positions) //positions are disabled
  }

  const onSubmitNewFlow = async (newFlowName: string) => {
    try {
      const response = await fetch(`/api/v1/flows/cloudapi/${newFlowName}/create`)
      const jsonData = await response.json()
      const filename = jsonData.filename
      await listFlows()
      setCurrentFlow(filename)
    } catch (e) {
      throw ({
        errorMsg: 'Error generating file, already exist',
        errorType: 500,
        file: newFlowName
      })
    }
  }

  const onDeleteFlow = (flow: string) => {
    setDeleteModal(flow)
  }
  const closeMonaco = () => {
    setVisibleCode(false)
  }
  const toggleMonaco = () => {
    setVisibleCode(!visibleCode)
  }

  const onConfirmDeleteFlow = async (flow: string) => {
    try {
      await fetch(`/api/v1/flows/cloudapi/${flow}/delete`)
      await listFlows()
      setCurrentFlow(DEFAULT_FLOW)
      setDeleteModal() // reset the delete modal
    } catch (e) { console.error(`Error deleting flow "${flow}"`) }
  }

  const onSelectFlow = async (flow: string) => {
    setCurrentFlow(flow)
    if (router.query?.filename) {
      const newRouterQuery = router.query;
      delete newRouterQuery["filename"]
      router.push({
        query: newRouterQuery
      })
    }
  }

  useEffect(() => {
    var components = CustomComponents(devicesList)
    components = components.concat(BaseJSMasks)
    setCustomComponents(components)
  }, [devicesList])

  useKeypress(['Escape', 'c', 'C'], (event) => {
    const userIsWritting = !(document.activeElement == document.body)
    const isEditorVisible = editorRef.current?.getBoundingClientRect()?.height > 0
    if (!isEditorVisible) return
    if (event.key == "Escape") {
      closeMonaco()
    } else if ((event.key == "c" || event.key == "C") && !userIsWritting) {
      return toggleMonaco()
    }
  });


  return (
    <div ref={editorRef} style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'row' }}>
      {ready
        ? <div style={{ height: '100%', width: '100%' }}>
          <Flow
            dataNotify={(data) => {
              if (data.notifyId) {
                mqttPub('datanotify/' + data.notifyId, JSON.stringify(data))
              }
            }}
            disableDots={!isActive}
            customComponents={customComponents}
            sourceCode={sourceCode}
            setSourceCode={setSourceCode}
            positions={positions}
            onSave={onSaveFlows}
            disableSideBar={visibleCode}
            onShowCode={toggleMonaco}
            onReload={onReload}
            store={flowStore}
            display={!visibleCode || SPLITCODEEDITOR}
            flowId={"flows"}
            showActionsBar
            config={{masks: UIMasks}}
            onSelectionChange={(dumpedCode) => setSelectedCode(dumpedCode)}
          >
          </Flow>
          <AIAssistant setSourceCode={setSourceCode} sourceCode={sourceCode} selectedCode={selectedCode} />
        </div>
        : null}
      {visibleCode
        ? <HStack h="100%" w={SPLITCODEEDITOR ? "55%" : '100%'} bgColor="white" borderLeftWidth={'0px'} alignItems="flex-start">
          <VStack p="10px" space="10px">
            <Pressable onPress={closeMonaco} title='Click here to close code.' style={{ display: 'flex', backgroundColor: '#373737', borderRadius: '14px', width: '40px', padding: '5px', alignItems: 'center' }}>
              <MaterialCommunityIcons name="close" color={'white'} size={25} />
            </Pressable>
            <Pressable onPress={onSaveMonaco} title='Click here to close code.' style={{ display: 'flex', backgroundColor: sourceCode == tmpMonacoCode ? '#BFBFBF' : '#373737', borderRadius: '14px', width: '40px', padding: '5px', alignItems: 'center' }}>
              <MaterialCommunityIcons name="content-save-outline" color={'white'} size={25} />
            </Pressable>
          </VStack>
          <Monaco onChange={onMonacoChange} sourceCode={SPLITCODEEDITOR ? sourceCode : tmpMonacoCode} onSave={onSaveMonaco} />
        </HStack>
        : <FlowSelector
          flows={flows}
          currentFlow={currentFlow}
          onSelectFlow={onSelectFlow}
          onDeleteFlow={onDeleteFlow}
          onSubmitNewFlow={onSubmitNewFlow}
        />}
      <FlowDeleteModal
        onDismiss={() => setDeleteModal()}
        onConfirm={async () => await onConfirmDeleteFlow(deleteModal)}
        flowToDelete={deleteModal}
      />
    </div>
  )
}
export default FlowsScreen;