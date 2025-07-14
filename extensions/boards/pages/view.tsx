import React from 'react'
import { Cable, Copy, Plus, Trash2, Settings, MoreVertical, X, ArrowLeft } from '@tamagui/lucide-icons'
import { API, getPendingResult } from 'protobase'
import { AdminPage } from "protolib/components/AdminPage"
import { useIsAdmin } from "protolib/lib/useIsAdmin"
import ErrorMessage from "protolib/components/ErrorMessage"
import { YStack, XStack, Paragraph, Button as TamaButton, Dialog, Theme, Spinner, Popover } from '@my/ui'
import { computeLayout } from '@extensions/autopilot/layout';
import { DashboardGrid } from 'protolib/components/DashboardGrid';
import { AlertDialog } from 'protolib/components/AlertDialog';
import { CenterCard } from '@extensions/services/widgets'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from 'protolib/components/Tinted'
import { useProtoStates } from '@extensions/protomemdb/lib/useProtoStates'
import { CardSelector } from 'protolib/components/board/CardSelector'
import { ActionCardSettings } from 'protolib/components/autopilot/ActionCardSettings'
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from 'protolib/components/Monaco'
import { IconContainer } from 'protolib/components/IconContainer'
import { usePageParams } from 'protolib/next'
import { usePendingEffect } from 'protolib/lib/usePendingEffect'
import { createParam } from 'solito'
import { AsyncView } from 'protolib/components/AsyncView'
import { Center } from 'protolib/components/Center'
import dynamic from 'next/dynamic'
import { useEventEffect } from '@extensions/events/hooks'
import { BoardControlsProvider, useBoardControls } from '../BoardControlsContext'

class ValidationError extends Error {
  errors: string[];

  constructor(errors: string[]) {
    super(errors.join('\n'));
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

const checkCard = async (cards, newCard) => {
  const errors = []
  console.log("cards: ", cards)
  console.log("newCard: ", newCard)
  const existingCard = cards.find(item => item.name === newCard.name && item.key !== newCard.key);
  if (existingCard) {
    console.error('A card with the same name already exists')
    errors.push('A card with the same name already exists')
  }
  if (newCard.name === '') {
    console.error('Card name cannot be empty')
    errors.push('Card name cannot be empty')
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

const generate_random_id = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const { useParams } = createParam()

const ActionRunner = dynamic(() => import('protolib/components/ActionRunner').then(mod => mod.ActionRunner), { ssr: false })
const RulesSideMenu = dynamic(() => import('protolib/components/autopilot/RulesSideMenu').then(mod => mod.RulesSideMenu), { ssr: false })

const CardIcon = ({ Icon, onPress, ...props }) => {
  return <Tinted>
    <XStack {...props} right={-10} hoverStyle={{ bg: '$backgroundFocus' }} pressStyle={{ bg: '$backgroundPress' }} borderRadius="$5" alignItems="center" justifyContent="center" cursor="pointer" p="$2" onPress={onPress}>
      <Icon size={20} onPress={onPress} />
    </XStack>
  </Tinted>
}

const FileWidget = dynamic<any>(() =>
  import('protolib/adminpanel/features/components/FilesWidget').then(module => module.FileWidget),
  { loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

const CardActions = ({ id, data, onEdit, onDelete, onEditCode, onCopy }) => {
  const [menuOpened, setMenuOpened] = useState(false)
  const MenuButton = ({ text, Icon, onPress }: { text: string, Icon: any, onPress: any }) => {
    return (
      <XStack id={id} ml="$1" o={1} br="$5" p="$3" als="flex-start" cursor="pointer" pressStyle={{ opacity: 0.7 }} hoverStyle={{ backgroundColor: "$color5" }}
        onPress={(e) => {
          onPress(e)
          setMenuOpened(false)
        }}
      >
        <Icon size="$1" color="var(--color9)" strokeWidth={2} />
        <Text ml="$3">{text}</Text>
      </XStack>
    )
  }
  return <Tinted>
    <XStack pt={"$2"}>
      {data?.sourceFile && <CardIcon Icon={Cable} onPress={onEditCode} />}
      <CardIcon Icon={Settings} onPress={onEdit} />
      <Popover onOpenChange={setMenuOpened} open={menuOpened} allowFlip>
        <Popover.Trigger>
          <CardIcon Icon={MoreVertical} onPress={(e) => { e.stopPropagation(); setMenuOpened(true) }} />
        </Popover.Trigger>
        <Popover.Content padding={0} space={0} left={"$7"} top={"$2"} bw={1} boc="$borderColor" bc={"$color1"} >
          <Tinted>
            <YStack alignItems="center" justifyContent="center" padding={"$3"} paddingVertical={"$3"} onPress={(e) => e.stopPropagation()}>
              <YStack>
                <MenuButton text="Duplicate" Icon={Copy} onPress={() => onCopy()} />
                <MenuButton text="Delete" Icon={Trash2} onPress={() => onDelete()} />
              </YStack>
            </YStack>
          </Tinted>
        </Popover.Content>
      </Popover>
    </XStack>
  </Tinted>
}

const ActionCard = ({ board, id, displayResponse, html, value = undefined, name, title, params, icon = undefined, color, onRun = (name, params) => { }, onEditCode = () => { }, onDelete = () => { }, onEdit = () => { }, onCopy = () => { }, data = {} as any, containerProps = {}, setData = (data, id) => { } }) => {
  const [status, setStatus] = useState('idle')
  useEventEffect((payload, msg) => {
    try {
      const parsedMessage = JSON.parse(msg.message);
      const payload = parsedMessage.payload
      console.log('Message: ', payload)
      switch (payload.status) {
        case 'running':
          console.log('Running action: ', name)
          setStatus('running')
          break;
        case 'done':
          console.log('Done action: ', name)
          setStatus('idle')
          break;
        case 'error':
          console.log('Error action: ', name)
          setStatus('error')
          console.error('Error executing action: ', payload.error)
          break;
        case 'code_error':
          console.log('Code error action: ', name)
          setStatus('error')
          console.error('Error in action code: ', payload.error)
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }, { path: "actions/boards/" + board.name + "/" + name + "/#" });
  return <CenterCard status={status} hideTitle={data.displayTitle === false} title={title} id={id} containerProps={containerProps} cardActions={<CardActions id={id} data={data} onDelete={onDelete} onEdit={onEdit} onEditCode={onEditCode} onCopy={onCopy} />} >
    <ActionRunner
      setData={setData}
      id={id}
      data={data}
      displayResponse={displayResponse}
      name={name}
      description={"Run action"}
      actionParams={params}
      onRun={onRun}
      icon={icon}
      color={color}
      html={html}
      value={value}
    />
  </CenterCard>
}

const FloatingButton = ({ Icon, beating = false, ...props }) => {
  const size = 34
  return <YStack
    jc="center"
    ai="center"
    br="$4"
    cursor='pointer'
    scaleIcon={1.8}
    w={size}
    h={size}
    hoverStyle={{ bg: '$gray2' }}
    {...props}
  >
    <Icon size={20} fill={props.fill ? "var(--color)" : "transparent"} {...props.iconProps} />
  </YStack>
}

const getExecuteAction = (board, rawActions) => {
  const actions = []
  const flatten = (obj, path) => {
    if (obj.url) {
      actions.push({ ...obj, path: path })
    } else {
      for (const key in obj) {
        flatten(obj[key], path + '/' + key)
      }
    }
  }
  flatten(rawActions, '')

  return async (url_or_name, params = {}) => {
    console.log('Executing action: ', url_or_name, params);
    const action = actions.find(a => a.url === url_or_name || (a.name === url_or_name && a.path == '/boards/' + board + '/' + a.name));
    if (!action) {
      console.error('Action not found: ', url_or_name);
      return;
    }

    console.log('Action: ', action)

    if (action.receiveBoard) {
      params.board = board.name
    }
    //check if the action has configParams and if it does, check if the param is visible
    //if the param is not visible, hardcode the param value to the value in the configParams defaultValue
    if (action.configParams) {
      for (const param in action.configParams) {
        if (action.configParams[param].visible === false && action.configParams[param].defaultValue != '') {
          params[param] = action.configParams[param].defaultValue
        }
      }
    }

    if (action.method === 'post') {
      let { token, ...data } = params;
      if (action.token) {
        token = action.token
      }
      //console.log('url: ', action.url+'?token='+token)
      const response = await API.post(action.url, data);
      return response.data
    } else {
      const paramsStr = Object.keys(params).map(k => k + '=' + params[k]).join('&');
      //console.log('url: ', action.url+'?token='+token+'&'+paramsStr)
      const response = await API.get(action.url + '?' + paramsStr);
      return response.data
    }
  }
}

const Board = ({ board, icons }) => {
  const {
    addOpened,
    rulesOpened,
    setAddOpened,
    setRulesOpened,
  } = useBoardControls();

  const breakpointCancelRef = useRef(null) as any
  const dedupRef = useRef() as any
  const addCard = { key: 'addwidget', type: 'addWidget', width: 2, height: 4 }
  const [items, setItems] = useState((board.cards && board.cards.length ? [...board.cards.filter(i => i).filter(key => key != 'addwidget')] : [addCard]))
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [editedCard, setEditedCard] = useState(null)
  const [editCode, setEditCode] = useState('')
  const [boardCode, setBoardCode] = useState(JSON.stringify(board))
  const [automationInfo, setAutomationInfo] = useState();
  const [rulesSize, setRulesSize] = useState(1010)
  const [errors, setErrors] = useState<string[]>([])
  // const initialBreakPoint = useInitialBreakpoint()
  const breakpointRef = useRef('') as any
  const { query, removeReplace, push } = usePageParams({})
  const isJSONView = query.json == 'true'
  const iconRotate = useRef(null) as any

  const [addKey, setAddKey] = useState(0)

  const { resolvedTheme } = useThemeSetting()
  const darkMode = resolvedTheme == 'dark'

  const states = useProtoStates({}, 'states/boards/' + board.name + '/#', 'states')

  //@ts-ignore store the states in the window object to be used in the cards htmls
  window['protoStates'] = states

  //@ts-ignore store the actions in the window object to be used in the cards htmls
  const actions = useProtoStates({}, 'actions/boards/' + board.name + '/#', 'actions')
  window['protoActions'] = actions

  const reloadBoard = async () => {
    const dataData = await API.get(`/api/core/v1/boards/${board.name}`)
    const automationInfo = await API.get(`/api/core/v1/boards/${board.name}/automation`)
    setAutomationInfo(automationInfo.data)
    if (dataData.status == 'loaded') {
      let newItems = (dataData.data?.cards || []).filter(card => card)
      if (!newItems || newItems.length == 0) newItems = [addCard]
      setItems(newItems)
    }
  }

  const getParsedJSON = (rawJson) => {
    let result = rawJson
    try {
      const parsed = JSON.parse(rawJson)
      result = JSON.stringify(parsed, null, 2)
    } catch (err) { }

    return result
  }

  useEffect(() => {
    window['executeAction'] = async (event, card) => {
      //This allows to call the action from <ActtionRunner />
      event.preventDefault();
      const formData = new FormData(event.target);
      const params = Object.fromEntries(formData['entries']());

      const cleanedParams = {};
      for (const key in params) {
        if (params[key] || params[key] === "0") {
          cleanedParams[key] = params[key];
        }
      }

      return await window['onRunListeners'][card](card, cleanedParams);
    };
  }, [])

  useEffect(() => {
    window['execute_action'] = getExecuteAction(board.name, actions)
    window['setCardData'] = (cardId, key, value) => {
      const card = items.find(item => item.key === cardId);
      if (card) {
        const newItems = items.map(item => {
          if (item.key === cardId) {
            return { ...item, [key]: value };
          }
          return item;
        });
        setItems(newItems);
        board.cards = newItems;
        API.post(`/api/core/v1/boards/${board.name}`, board);
      } else {
        console.error('Card not found:', cardId);
      }
    }
  }, [actions])
  useUpdateEffect(() => {
    // console.log('///////////////////////////////////////////////////////')
    // console.log('Board states: ', states)
    // console.log('///////////////////////////////////////////////////////')
    reloadBoard()
  }, [states, actions])

  const boardRef = React.useRef(board)

  const deleteCard = async (card) => {
    const newItems = items.filter(item => item.key != card.key)
    // if (newItems.length == 0) newItems.push(addCard) // non necessary
    setItems(newItems)
    boardRef.current.cards = newItems
    await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
    setIsDeleting(false)
    setCurrentCard(null)
  }

  const layouts = useMemo(() => {
    return {
      lg: computeLayout(items, { totalCols: 24, normalW: 8, normalH: 6, doubleW: 8, doubleH: 6 }, { layout: board?.layouts?.lg }),
      md: computeLayout(items, { totalCols: 24, normalW: 10, normalH: 6, doubleW: 10, doubleH: 6 }, { layout: board?.layouts?.md }),
      sm: computeLayout(items, { totalCols: 2, normalW: 2, normalH: 6, doubleW: 2, doubleH: 6 }, { layout: board?.layouts?.sm }),
      xs: computeLayout(items, { totalCols: 1, normalW: 1, normalH: 6, doubleW: 1, doubleH: 6 }, { layout: board?.layouts?.sm }),
    }
  }, [items, board?.layouts])

  boardRef.current.layouts = layouts

  const addWidget = async (card) => {
    try {
      await checkCard(items, card)
    } catch (e) {
      throw new Error(e)
    }

    setItems(prevItems => {
      const uniqueKey = card.type + '_' + Date.now();
      const newCard = { ...card, key: uniqueKey }
      const newItems = [...prevItems, newCard].filter(item => item.key !== 'addwidget');
      boardRef.current.cards = newItems;
      API.post(`/api/core/v1/boards/${board.name}`, boardRef.current);
      return newItems;
    });
  };

  const setCardContent = (key, content) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.key === key) {
          return { ...item, ...content };
        }
        return item;
      });
      boardRef.current.cards = newItems;
      API.post(`/api/core/v1/boards/${board.name}`, boardRef.current);
      return newItems;
    });
  }

  const onEditBoard = async () => {
    try {
      const newBoard = JSON.parse(boardCode)
      const boardRes = await API.post(`/api/core/v1/boards/${board.name}`, newBoard)
      if (!boardRes.isError) {
        boardRef.current = newBoard
        setItems(newBoard.cards)
        push('json', 'false')
        removeReplace('json')
      }
    } catch (err) {
      alert('Error editing board')
    }
  }

  //fill items with react content, addWidget should be the last item
  const cards = items.map((item) => {
    if (item.type == 'addWidget') {
      return {
        ...item,
        content: <CenterCard title={"Add new card"} id={item.key}>
          <YStack alignItems="center" justifyContent="center" f={1} width="100%" opacity={1}>
            <YStack
              bc={"$gray7"}
              f={1}
              w={"100%"}
              p="$2"
              pressStyle={{ bg: '$gray8' }}
              borderRadius="$5"
              hoverStyle={{ opacity: 0.75 }}
              alignItems='center'
              justifyContent='center'
              className="no-drag"
              cursor="pointer"
              bw={1}
              onPress={() => setAddOpened(true)}
            >
              <Plus col={"$gray10"} size={60} />
            </YStack>
          </YStack>
        </CenterCard>
      }
    } else {
      return {
        ...item,
        content: <ActionCard
          board={board}
          data={item}
          html={item.html}
          displayResponse={item.displayResponse}
          name={item.name}
          color={item.color}
          icon={item.icon ? (item.html ? item.icon : '/public/icons/' + item.icon + '.svg') : undefined}
          id={item.key}
          title={item.name}
          params={item.params}
          containerProps={item.containerProps}
          onCopy={() => {
            //duplicate the card, adding a _x to the name
            const newCard = {
              ...item,
              key: item.key.replace(/_vento_copy_.+$/, '') + '_vento_copy_' + generate_random_id(),
              name: item.name.replace(/ _\d+$/, '') + ' _' + (parseInt(item.name.match(/_(\d+)$/)?.[1] || '1') + 1)
            };
            setItems(prevItems => {
              const newItems = [...prevItems, newCard].filter(i => i.key !== 'addwidget');
              boardRef.current.cards = newItems;
              API.post(`/api/core/v1/boards/${board.name}`, boardRef.current);
              return newItems;
            });
          }}
          onDelete={() => {
            setIsDeleting(true);
            setCurrentCard(item);
          }}
          onEdit={() => {
            setIsEditing(true);
            setCurrentCard(item);
            setEditedCard(item);
          }}
          onEditCode={() => {
            setEditCode(item.sourceFile)
          }}

          setData={(data, id) => {
            setCardContent(id, data)
            console.log('setData called with:', data, id);
          }}

          value={states?.boards?.[board.name]?.[item.name] ?? undefined}
          onRun={async (name, params) => {
            const paramsStr = Object.keys(params ?? {}).map(key => key + '=' + params[key]).join('&');
            return (await API.get(`/api/core/v1/boards/${board.name}/actions/${name}?${paramsStr}`)).data;
          }}
        />
      };
    }
  })

  return (
    <YStack flex={1}>

      <CardSelector key={addKey} board={board} addOpened={addOpened} setAddOpened={setAddOpened} onFinish={addWidget} states={states} icons={icons} actions={actions} />

      <AlertDialog
        acceptButtonProps={{ color: "white", backgroundColor: "$red9" }}
        p="$5"
        acceptCaption="Delete"
        setOpen={setIsDeleting} Add commentMore actions
        open={isDeleting}
        onAccept={async (seter) => {
          await deleteCard(currentCard)
        }}
        acceptTint="red"
        title={`Delete "${currentCard?.name}"`}
        description={"Are you sure you want to delete this card?"}
      >
      </AlertDialog>

      <Theme reset>
        <Dialog modal open={isEditing} onOpenChange={setIsEditing}>
          <Dialog.Portal zIndex={100000} overflow='hidden'>
            <Dialog.Overlay />
            <Dialog.Content
              bordered
              elevate
              animateOnly={['transform', 'opacity']}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
              w={"90vw"}
              h={"95vh"}
              maw={1600}
            >
              <ActionCardSettings board={board} actions={actions} states={states} icons={icons} card={currentCard} onEdit={(data) => {
                setEditedCard(data)
              }} />
              {errors.length > 0 ?
                <YStack>
                  {errors.map((error, index) => (
                    <Paragraph key={"err" + index} color="$red9" fontSize="$4">{error}</Paragraph>
                  ))}
                </YStack>
                : <></>
              }

              <Dialog.Close displayWhenAdapted asChild>
                <Tinted><TamaButton onPress={async () => {
                  const newItems = items.map(item => item.key == currentCard.key ? editedCard : item)
                  setItems(newItems)
                  boardRef.current.cards = newItems
                  try {
                    await checkCard(newItems, editedCard)
                  } catch (e) {
                    if (e instanceof ValidationError) {
                      setErrors(e.errors);
                    } else {
                      console.error('Error checking card:', e);
                      setErrors(['An unexpected error occurred while checking the card.']);
                    }
                    return
                  }
                  await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                  setCurrentCard(null)
                  setIsEditing(false)
                }}>
                  Save
                </TamaButton></Tinted>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </Theme>



      <Theme reset>
        <Dialog modal open={editCode} onOpenChange={setEditCode}>
          <Dialog.Portal zIndex={100000} overflow='hidden'>
            <Dialog.Overlay />
            <Dialog.Content
              bordered
              elevate
              animateOnly={['transform', 'opacity']}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
              w={"90vw"}
              h={"95vh"}
              maw={1600}
            >
              <FileWidget
                masksPath={'/workspace/actions'}
                id={"file-widget-" + editCode}
                hideCloseIcon={false}
                isModified={true}
                setIsModified={() => { }}
                icons={[
                  <IconContainer onPress={() => {
                    setEditCode('')
                  }}>
                    <X color="var(--color)" size={"$1"} />
                  </IconContainer>
                ]}
                currentFileName={editCode.split && editCode.split('/').pop()}
                currentFile={editCode}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </Theme>





      <XStack f={1}>
        <YStack f={1}>
          {
            isJSONView
              ? <Monaco
                language='json'
                darkMode={resolvedTheme === 'dark'}
                sourceCode={getParsedJSON(boardCode)}
                onChange={setBoardCode}
                options={{
                  formatOnPaste: true,
                  formatOnType: true
                }}
              />
              : <YStack left={-10} f={1}><DashboardGrid
                items={cards}
                layouts={boardRef.current.layouts}
                borderRadius={10}
                padding={10}
                backgroundColor="white"
                onLayoutChange={(layout, layouts) => {
                  if (breakpointCancelRef.current == breakpointRef.current) {
                    console.log('Layout change cancelled for breakpoint: ', breakpointRef.current, breakpointCancelRef.current)
                    breakpointCancelRef.current = null
                    return
                  }

                  //small dedup to avoid multiple saves in a short time
                  if (JSON.stringify(boardRef.current.layouts[breakpointRef.current]) == JSON.stringify(layout)) {
                    console.log('Layout not changed, skipping save')
                    return
                  }

                  console.log('programming layout change: ', breakpointRef.current)
                  clearInterval(dedupRef.current)
                  dedupRef.current = setTimeout(() => {
                    console.log('Layout changed: ', breakpointRef.current)
                    console.log('Prev layout: ', boardRef.current.layouts[breakpointRef.current])
                    console.log('New layout: ', layout)
                    boardRef.current.layouts[breakpointRef.current] = layout
                    API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                  }, 100)
                }}
                onBreakpointChange={(bp) => {
                  clearInterval(dedupRef.current)
                  console.log('Breakpoint changed to: ', bp)
                  breakpointRef.current = bp
                  //after changing breakpoint a onLaoutChange is triggered but its not necessary to save the layout
                  breakpointCancelRef.current = bp
                  setTimeout(() => {
                    breakpointCancelRef.current = null //reset the cancel flag after 1 second
                  }, 1000)
                }}
              /></YStack>
          }
        </YStack>
        <div
          onClick={() => setRulesOpened(false)}
          style={{ width: "100vw", height: "120vh", position: "fixed", right: rulesOpened ? 0 : "-100vw" }}
        ></div>
        {
          <XStack position="fixed" animation="quick" right={rulesOpened ? 40 : -rulesSize} top={"70px"} width={rulesSize} height="calc(100vh - 100px)">

            <XStack zIndex={-1} width="100%" br="$5" height={"100%"} position="absolute" top="0" left="0" backgroundColor={darkMode ? '$bgPanel' : 'white'} opacity={1}></XStack>

            {automationInfo && <RulesSideMenu leftIcons={<XStack zIndex={9999}>
              <XStack ref={iconRotate} cursor='pointer' onPress={() => {
                setRulesSize(prev => {
                  if (prev === 1010) {
                    iconRotate.current.style.rotate = '180deg'
                  } else {
                    iconRotate.current.style.rotate = '0deg'
                  }
                  return prev === 1010 ? window.innerWidth - 330 : 1010
                })
              }} o={0.8} pressStyle={{ opacity: 0.8 }} hoverStyle={{ opacity: 1 }}>
                <ArrowLeft size="$1" color="var(--color)" />
              </XStack>
            </XStack>}
              automationInfo={automationInfo} boardRef={boardRef} board={board} actions={actions} states={states}></RulesSideMenu>}
          </XStack>
        }
      </XStack>
    </YStack>
  )
}

const BoardViewLoader = ({ workspace, boardData, iconsData, params, pageSession }) => {
  const {
    rulesOpened,
    setRulesOpened,
    toggleJson,
    saveJson,
    toggleAutopilot,
    openAdd
  } = useBoardControls();

  const onFloatingBarEvent = (event) => {
    if (event.type === 'toggle-rules') {
      setRulesOpened(!rulesOpened);
    }
    if (event.type === 'toggle-json') {
      toggleJson();
    }
    if (event.type === 'save-json') {
      saveJson();
    }
    if (event.type === 'toggle-autopilot') {
      toggleAutopilot();
    }
    if (event.type === 'open-add') {
      openAdd();
    }
  }

  return <AsyncView ready={boardData.status != 'loading' && iconsData.status != 'loading'}>
    <AdminPage
      title={params.board + " board"}
      workspace={workspace}
      pageSession={pageSession}
      onActionBarEvent={onFloatingBarEvent}
    >
      {boardData.status == 'error' && <ErrorMessage
        msg="Error loading board"
        details={boardData.error.error}
      />}
      {boardData.status == 'loaded' && <Board board={boardData.data} icons={iconsData.data?.icons} />}
    </AdminPage>
  </AsyncView>
}

export const BoardView = ({ workspace, pageState, initialItems, itemData, pageSession, extraData, board, icons }: any) => {
  const { params } = useParams()
  const [boardData, setBoardData] = useState(board ?? getPendingResult('pending'))
  usePendingEffect((s) => { API.get({ url: `/api/core/v1/boards/${params.board}/` }, s) }, setBoardData, board)

  const [iconsData, setIconsData] = useState(icons ?? getPendingResult('pending'))
  usePendingEffect((s) => { API.get({ url: `/api/core/v1/icons` }, s) }, setIconsData, icons)
  useIsAdmin(() => '/workspace/auth/login?return=' + document?.location?.pathname + (document?.location?.search ? '?' + document?.location?.search : ''))

  return (<BoardControlsProvider boardName={params.board}>
    <BoardViewLoader
      workspace={workspace}
      boardData={boardData}
      iconsData={iconsData}
      params={params}
      pageSession={pageSession}
    />
  </BoardControlsProvider>
  )
}