import { Cable, ClipboardList, Copy, Pause, Play, Plus, Save, Settings, Trash2, X } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, getPendingResult, set } from 'protobase'
import { DataTable2 } from "protolib/components/DataTable2"
import { DataView, DataViewActionButton } from "protolib/components/DataView"
import { AdminPage } from "protolib/components/AdminPage"
import { PaginatedData, SSR } from "protolib/lib/SSR"
import { withSession } from "protolib/lib/Session"
import { useIsAdmin } from "protolib/lib/useIsAdmin"
import ErrorMessage from "protolib/components/ErrorMessage"
import { YStack, XStack, Paragraph, Button as TamaButton, Dialog, Stack, Switch, Button, Theme, Spinner } from '@my/ui'
import { computeLayout } from '@extensions/autopilot/layout';
import { DashboardGrid, useInitialBreakpoint } from 'protolib/components/DashboardGrid';
import { AlertDialog } from 'protolib/components/AlertDialog';
import { CardValue, CenterCard } from '@extensions/services/widgets'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from 'protolib/components/Tinted'
import React from 'react'
import { useProtoStates } from '@extensions/protomemdb/lib/useProtoStates'
import { CardSelector } from 'protolib/components/board/CardSelector'

import { ActionCardSettings } from 'protolib/components/autopilot/ActionCardSettings'
import { useRouter } from 'solito/navigation';
import { useThemeSetting } from '@tamagui/next-theme'
import BoardPreview from 'protolib/components/board/BoardPreview'
import { Monaco } from 'protolib/components/Monaco'
import { IconContainer } from 'protolib/components/IconContainer'
import { usePageParams } from 'protolib/next'
import { jsonToDiv } from 'protolib/lib/jsonToDiv'
import { usePendingEffect } from 'protolib/lib/usePendingEffect'
import { createParam } from 'solito'
import { AsyncView } from 'protolib/components/AsyncView'
import { Center } from 'protolib/components/Center'
import dynamic from 'next/dynamic'


const generate_random_id = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const { useParam, useParams } = createParam()

const ActionRunner = dynamic(() => import('protolib/components/ActionRunner').then(mod => mod.ActionRunner), { ssr: false })
const RulesSideMenu = dynamic(() => import('protolib/components/autopilot/RulesSideMenu').then(mod => mod.RulesSideMenu), { ssr: false })

const sourceUrl = '/api/core/v1/boards'
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

  return <Tinted>
    <XStack pt={"$2"}>
      {data?.sourceFile && <CardIcon Icon={Cable} onPress={onEditCode} />}
      <CardIcon Icon={Copy} onPress={onCopy} />
      <CardIcon Icon={Settings} onPress={onEdit} />
      <CardIcon Icon={Trash2} onPress={onDelete} />
    </XStack>
  </Tinted>
}

const ActionCard = ({ id, displayResponse, html, value = undefined, name, title, params, icon = undefined, color, onRun = (name, params) => { }, onEditCode = () => { }, onDelete = () => { }, onEdit = () => { }, onCopy = () => { }, data = {} as any, containerProps = {}, setData = (data, id) => { } }) => {
  return <CenterCard titleMode={data.titleMode} title={title} id={id} containerProps={containerProps} cardActions={<CardActions id={id} data={data} onDelete={onDelete} onEdit={onEdit} onEditCode={onEditCode} onCopy={onCopy} />} >
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
    const action = actions.find(a => a.url === url_or_name || (a.name === url_or_name && a.path == '/boards/'+board+'/' + a.name));
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
  const breakpointCancelRef = useRef(null) as any
  const dedupRef = useRef() as any
  const addCard = { key: 'addwidget', type: 'addWidget', width: 2, height: 6 }
  const router = useRouter()
  const [items, setItems] = useState((board.cards && board.cards.length ? [...board.cards.filter(i => i).filter(key => key != 'addwidget')] : [addCard]))
  const [addOpened, _setAddOpened] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [editedCard, setEditedCard] = useState(null)
  const [autopilot, setAutopilot] = useState(board.autopilot)
  const [rulesOpened, setRulesOpened] = useState(false)
  const [editCode, setEditCode] = useState('')
  const [boardCode, setBoardCode] = useState(JSON.stringify(board))
  const [automationInfo, setAutomationInfo] = useState();
  // const initialBreakPoint = useInitialBreakpoint()
  const breakpointRef = useRef('') as any
  const { query, removeReplace, push } = usePageParams()
  const isJSONView = query.json == 'true'

  const [addKey, setAddKey] = useState(0)

  const setAddOpened = (value) => {
    _setAddOpened(value)
    if (value) setAddKey(prev => prev + 1)
  }

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
      console.log('Running action with params:', params, 'in card: ', card);
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
      lg: computeLayout(items, { totalCols: 12, normalW: 2, normalH: 6, doubleW: 4, doubleH: 12 }, { layout: board?.layouts?.lg }),
      md: computeLayout(items, { totalCols: 6, normalW: 2, normalH: 6, doubleW: 2, doubleH: 6 }, { layout: board?.layouts?.md }),
      sm: computeLayout(items, { totalCols: 1, normalW: 1, normalH: 12, doubleW: 1, doubleH: 12 }, { layout: board?.layouts?.sm }),
    }
  }, [items, board?.layouts])

  boardRef.current.layouts = layouts

  const addWidget = async (card) => {
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


      <XStack p="$2" bc="red" als="center" pos="fixed" elevation={10} bw={1} boc="$gray6" animation="quick" bc="$bgPanel" zi={99999} b={rulesOpened ? -200 : 16} gap="$3" br="$5">
        {
          isJSONView
            ? <Tinted>
              <FloatingButton
                Icon={X}
                iconProps={{ color: "$gray9" }}
                onPress={() => removeReplace('json')}
              />
              <FloatingButton
                Icon={Save}
                onPress={onEditBoard}
              />
            </Tinted>
            : <Tinted>
              <FloatingButton
                Icon={Plus}
                onPress={async () => {
                  setAddOpened(true)
                }}
              />
              <FloatingButton
                beating={autopilot}
                fill={autopilot ? false : true}
                Icon={autopilot ? Pause : Play}
                iconProps={{ ml: autopilot ? 0 : 2 }}
                onPress={async () => {
                  let newValue = !autopilot
                  setAutopilot(newValue)
                  boardRef.current.autopilot = newValue
                  await API.get(`/api/core/v1/boards/${board.name}/autopilot/${newValue ? 'on' : 'off'}`)
                }}
                hoverStyle={{ bg: '$color5' }}
                bc={autopilot ? "$color7" : "transparent"}
                br="$20"
              />
              <FloatingButton
                Icon={ClipboardList}
                onPress={async () => {
                  setRulesOpened(!rulesOpened)
                }}
              />
            </Tinted>
        }

      </XStack>

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
              <Dialog.Close displayWhenAdapted asChild>
                <Tinted><TamaButton onPress={async () => {
                  const newItems = items.map(item => item.key == currentCard.key ? editedCard : item)
                  setItems(newItems)
                  boardRef.current.cards = newItems
                  await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                  setCurrentCard(null)
                  setIsEditing(false)
                  setEditedCard(null)
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
              : <DashboardGrid
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
              />
          }
        </YStack>
        <div
          onClick={() => setRulesOpened(false)}
          style={{ width: "100vw", height: "120vh", position: "fixed", right: rulesOpened ? 0 : "-100vw" }}
        ></div>
        {
          <XStack position="fixed" animation="quick" right={rulesOpened ? 20 : -1000} top={"70px"} width={810} height="calc(100vh - 100px)">
            <XStack width="100%" br="$5" height={"100%"} position="absolute" top="0" left="0" backgroundColor={darkMode ? '$bgPanel' : 'white'} opacity={0.9}></XStack>
            {automationInfo && <RulesSideMenu automationInfo={automationInfo} boardRef={boardRef} board={board} actions={actions} states={states}></RulesSideMenu>}
          </XStack>
        }
      </XStack>

    </YStack>
  )
}

const BoardView = ({ workspace, pageState, initialItems, itemData, pageSession, extraData, board, icons }: any) => {
  const { params } = useParams()

  const [boardData, setBoardData] = useState(board ?? getPendingResult('pending'))
  usePendingEffect((s) => { API.get({ url: `/api/core/v1/boards/${params.board}/` }, s) }, setBoardData, board)

  const [iconsData, setIconsData] = useState(icons ?? getPendingResult('pending'))
  usePendingEffect((s) => { API.get({ url: `/api/core/v1/icons` }, s) }, setIconsData, icons)
  useIsAdmin(() => '/workspace/auth/login?return=' + document?.location?.pathname + (document?.location?.search ? '?' + document?.location?.search : ''))
  return (<AsyncView ready={boardData.status != 'loading' && iconsData.status != 'loading'}>
    <AdminPage title={params.board + " board"} workspace={workspace} pageSession={pageSession}>
      {boardData.status == 'error' && <ErrorMessage
        msg="Error loading board"
        details={boardData.error.error}
      />}
      {boardData.status == 'loaded' && <Board board={boardData.data} icons={iconsData.data?.icons} />}
    </AdminPage>
  </AsyncView>)
}

export default {
  boards: {
    component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
      const router = useRouter()

      return (<AdminPage title="Boards" workspace={workspace} pageSession={pageSession}>
        <DataView
          entityName={"boards"}
          itemData={itemData}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          onAdd={(data) => { router.push(`/boards/view?board=${data.name}`); return data }}
          name="Board"
          disableViews={['raw']}
          onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
          onSelectItem={(item) => router.push(`/boards/view?board=${item.data.name}`)}
          columns={DataTable2.columns(
            DataTable2.column("name", row => row.name, "name")
          )}

          model={BoardModel}
          pageState={pageState}
          dataTableGridProps={{
            getCard: (element, width) => <BoardPreview
              onDelete={async () => {
                await API.get(`${sourceUrl}/${element.name}/delete`);
              }}
              onPress={(e) => {
                const dialogContent = e.target.closest('.is_DialogContent')
                if (dialogContent) return
                router.push(`/boards/view?board=${element.name}`)
              }}
              element={element} width={width} />,
          }}
          defaultView={"grid"}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  },
  view: {
    component: (props: any) => {
      const { params } = useParams()

      return <AsyncView ready={params.board ? true : false}>
        <BoardView key={params.board} {...props} board={undefined} />
      </AsyncView>
    },
    getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async (session) => {
      return {
        board: await API.get(`/api/core/v1/boards/${context.params.board}/?token=${session?.token}`),
        icons: (await API.get(`/api/core/v1/icons?token=${session?.token}`))?.data?.icons ?? []
      }
    }))
  }
}