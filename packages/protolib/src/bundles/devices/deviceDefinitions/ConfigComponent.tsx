import React, { useState, useEffect, useRef } from 'react'
import { Button, XStack } from 'tamagui'
import { AlertDialog } from '../../../components/AlertDialog'
import Flows from '../../../adminpanel/features/components/Flows'
import { getFlowsCustomSnippets } from 'app/bundles/snippets'
import { getFlowsMenuConfig } from 'app/bundles/flows'
import { getFlowMasks, getFlowsCustomComponents } from 'app/bundles/masks'
import { useThemeSetting } from '@tamagui/next-theme'
import { useSearchParams, usePathname } from 'solito/navigation'
import layout from './DeviceLayout'


export const ConfigComponent = ({ path, data, setData, mode, originalData, cores, boards }) => {
  console.log("🤖 ~ ConfigComponent ~ path:", path)
  const selectedSdk = originalData.sdk
  const selectedBoard = originalData.board


  if(selectedSdk.startsWith('esphome')) {
    const defaultJsCode = {
        components:
          '[\n "mydevice",\n "esp32dev",\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n];\n\n',
      }
    const [sourceCode, setSourceCode] = useState(defaultJsCode.components)
    const [editedObjectData, setEditedObjectData] = useState<any>({})
    const [showDialog, setShowDialog] = useState(false)
    const { resolvedTheme } = useThemeSetting()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const query = Object.fromEntries(searchParams.entries())
    const isInitialLoad = useRef(true)

    useEffect(() => {
        if (mode === 'add' && isInitialLoad.current) {
            isInitialLoad.current = false
            const esphomeBoardName = originalData.board.name
            const generatedComponents = generateBoardJs(esphomeBoardName)
            if (generatedComponents) {
            setSourceCode(generatedComponents.components)
            }
        } else {
            setSourceCode(data.components)
        }
        setEditedObjectData({ path, data, setData, mode })
    }, [data, mode, originalData])

    const generateBoardJs = (boardName) => {
        const board = boards.find((board) => board.name === boardName)
        if (!board) {
            console.error('Board not found')
            return null
        }
        const components = ['mydevice', boardName]
        board.ports.forEach(() => {
            components.push(null)
        })
        return { components: JSON.stringify(components) + ';' }
    }

    
    return (
      <>
        <Button onPress={() => setShowDialog(true)}>Edit Config</Button>
        <AlertDialog open={showDialog} setOpen={(open) => setShowDialog(open)} hideAccept={true} style={{ width: "80%", height: "80%", padding: '0px', overflow: 'hidden' }}>
            <XStack f={1} minWidth={'100%'}>
                <Flows
                    style={{ width: "100%" }}
                    disableDots={false}
                    hideBaseComponents={true}
                    disableStart={true}
                    autoFitView={true}
                    getFirstNode={(nodes) => {
                    return nodes.find(n => n.type == 'ArrayLiteralExpression')
                    }}
                    showActionsBar={true}
                    onSave={
                    (code)=>{
                        editedObjectData.setData({ components: code })
                    }
                    }
                    layout={layout}
                    customComponents={getFlowsCustomComponents(pathname, query)}
                    customSnippets={getFlowsCustomSnippets(pathname, query)}
                    bridgeNode={false}
                    setSourceCode={(sourceCode) => {
                    console.log('set new sourcecode from flows: ', sourceCode)
                    setSourceCode(sourceCode)
                    }}
                    sourceCode={sourceCode}
                    themeMode={resolvedTheme}
                    key={'flow'}
                    config={{ masks: getFlowMasks(pathname, query), layers: [], menu: getFlowsMenuConfig(pathname, query) }}
                    bgColor={'transparent'}
                    dataNotify={(data: any) => {
                    if (data.notifyId) {
                        //mqttPub('datanotify/' + data.notifyId, JSON.stringify(data))
                    }
                    }}
                    onEdit={(code) => editedObjectData.setData({ components: code })}
                    positions={[]}
                    disableSideBar={true}
                    // store={uiStore}
                    display={true}
                    flowId={"flows-editor"}
                    metadata={{board: selectedBoard, sdk: selectedSdk}}
                />
            </XStack>
        </AlertDialog>
      </>
    )
  } else if (selectedSdk === 'binary') {
    return (
        <div style={{ padding: 20 }}>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0]
              console.log('File uploaded: ', file)
            }}
          />
        </div>
      )
    } else {
        return <a>SDK not defined</a>
    }

}
