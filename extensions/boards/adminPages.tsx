import { ArrowLeft, BookOpen, Plus, Save, Settings, Sparkles, Tag, Trash2, X } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, getPendingResult } from 'protobase'
import { DataTable2 } from "protolib/components/DataTable2"
import { DataView, DataViewActionButton } from "protolib/components/DataView"
import { AdminPage } from "protolib/components/AdminPage"
import { PaginatedData, SSR } from "protolib/lib/SSR"
import { withSession } from "protolib/lib/Session"
import ErrorMessage from "protolib/components/ErrorMessage"
import { YStack, XStack, Paragraph, Button as TamaButton, Dialog, Stack, Switch, Button } from '@my/ui'
import { computeLayout } from '@extensions/autopilot/layout';
import { DashboardGrid } from 'protolib/components/DashboardGrid';
import { AlertDialog } from 'protolib/components/AlertDialog';
import { CardValue, CenterCard } from '@extensions/services/widgets'
import { useEffect, useRef, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from 'protolib/components/Tinted'
import React from 'react'
import { useProtoStates } from '@extensions/protomemdb/lib/useProtoStates'
import { CardSelector } from 'protolib/components/board/CardSelector'

import { ValueCardSettings } from 'protolib/components/autopilot/ValueCardSettings'
import { ActionCardSettings } from 'protolib/components/autopilot/ActionCardSettings'
import { RulesSideMenu } from 'protolib/components/autopilot/RulesSideMenu'
import { useRouter } from 'solito/navigation';
import { useThemeSetting } from '@tamagui/next-theme'
import BoardPreview from 'protolib/components/board/BoardPreview'
import { Monaco } from 'protolib/components/Monaco'
import { usePageParams } from 'protolib/next'
import { jsonToDiv } from 'protolib/lib/jsonToDiv'
import { usePendingEffect } from 'protolib/lib/usePendingEffect'
import { createParam } from 'solito'
import { AsyncView } from 'protolib/components/AsyncView'

const { useParam, useParams } = createParam()

import dynamic from 'next/dynamic'
const ActionRunner = dynamic(() => import('protolib/components/ActionRunner').then(mod => mod.ActionRunner), { ssr: false })

const sourceUrl = '/api/core/v1/boards'
const CardIcon = ({ Icon, onPress, ...props }) => {
  return <Tinted>
    <XStack {...props} right={-10} hoverStyle={{ bg: '$backgroundFocus' }} pressStyle={{ bg: '$backgroundPress' }} borderRadius="$5" alignItems="center" justifyContent="center" cursor="pointer" p="$2" onPress={onPress}>
      <Icon size={20} onPress={onPress} />
    </XStack>
  </Tinted>
}

const CardActions = ({ id, onEdit, onDelete }) => {
  return <Tinted>
    <XStack pt={"$2"}>
      <CardIcon Icon={Settings} onPress={onEdit} />
      <CardIcon Icon={Trash2} onPress={onDelete} />
    </XStack>
  </Tinted>
}

const ValueCard = ({ id, title, html, value, icon = undefined, color, onDelete = () => { }, onEdit = () => { }, data = {}, containerProps = {} }) => {
  return <CenterCard title={title} id={id} containerProps={containerProps} cardActions={<CardActions id={id} onDelete={onDelete} onEdit={onEdit} />} >
    <CardValue
      Icon={icon ?? 'tag'}
      value={value ?? 'N/A'}
      color={color}
      html={html}
      {...data}
    />
  </CenterCard>
}

const ActionCard = ({ id, displayResponse, html, name, title, params, icon = undefined, color, onRun = (name, params) => { }, onDelete = () => { }, onEdit = () => { }, data = {}, containerProps = {} }) => {
  return <CenterCard title={title} id={id} containerProps={containerProps} cardActions={<CardActions id={id} onDelete={onDelete} onEdit={onEdit} />} >
    <ActionRunner
      data={data}
      displayResponse={displayResponse}
      name={name}
      description={"Run action"}
      actionParams={params}
      onRun={onRun}
      icon={icon}
      color={color}
      html={html}
    />
  </CenterCard>
}

const Board = ({ board, icons }) => {
  const breakpointCancelRef = useRef(null) as any
  const dedupRef = useRef() as any
  const addCard = { key: 'addwidget', type: 'addWidget', width: 2, height: 6 }
  const router = useRouter()
  const [items, setItems] = useState((board.cards && board.cards.length ? [...board.cards.filter(key => key != 'addwidget')] : [addCard]))
  const [addOpened, setAddOpened] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [editedCard, setEditedCard] = useState(null)
  const [autopilot, setAutopilot] = useState(board.autopilot)
  const [rulesOpened, setRulesOpened] = useState(false)
  const [boardCode, setBoardCode] = useState(JSON.stringify(board))
  const breakpointRef = useRef('lg')
  const { query, removeReplace, push } = usePageParams()
  const isJSONView = query.json == 'true'

  const { resolvedTheme } = useThemeSetting()
  const darkMode = resolvedTheme == 'dark'

  const states = useProtoStates({}, 'states/boards/' + board.name + '/#', 'states')
  const actions = useProtoStates({}, 'actions/boards/' + board.name + '/#', 'actions')

  const reloadBoard = async () => {
    const dataData = await API.get(`/api/core/v1/boards/${board.name}`)
    if (dataData.status == 'loaded') {
      let newItems = dataData.data?.cards
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
      const response = await window['onRunListeners'][card](card, cleanedParams);
      const responseElement = document.getElementById(card + '_response');
      if (responseElement) {
        responseElement.innerHTML = jsonToDiv(response, 0, 2);
      }
    };
  }, [])

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

  const layouts = {
    lg: computeLayout(items, { totalCols: 12, normalW: 2, normalH: 6, doubleW: 4, doubleH: 12 }, { layout: board?.layouts?.lg }),
    md: computeLayout(items, { totalCols: 6, normalW: 2, normalH: 6, doubleW: 2, doubleH: 6 }, { layout: board?.layouts?.md }),
    sm: computeLayout(items, { totalCols: 1, normalW: 1, normalH: 12, doubleW: 1, doubleH: 12 }, { layout: board?.layouts?.sm }),
  }

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
    } else if (item.type == 'value') {
      return {
        ...item,
        content: <ValueCard data={item} html={item.html} color={item.color} icon={item.icon} id={item.key} title={item.name} value={item.value ?? 'N/A'} onDelete={() => {
          setIsDeleting(true)
          setCurrentCard(item)
        }} onEdit={() => {
          setIsEditing(true)
          setCurrentCard(item)
          setEditedCard(item)
        }}
          containerProps={item.containerProps}
        />
      }
    } else if (item.type == 'action') {
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
          onDelete={() => {
            setIsDeleting(true);
            setCurrentCard(item);
          }}
          onEdit={() => {
            setIsEditing(true);
            setCurrentCard(item);
            setEditedCard(item);
          }}
          onRun={async (name, params) => {
            const paramsStr = Object.keys(params ?? {}).map(key => key + '=' + params[key]).join('&');
            return (await API.get(`/api/core/v1/boards/${board.name}/actions/${name}?${paramsStr}`)).data;
          }}
        />
      };
    }
    return item
  })

  return (
    <YStack flex={1}>
      <XStack px={"$5"} py={"$3"}>
        <XStack f={1} alignItems='center' >
          <Tinted>
            <DataViewActionButton
              icon={(props) => <ArrowLeft {...props} color="var(--color10)" />}
              description="Back"
              onPress={() => router.push("/boards")}
              mr="$5"
            />
          </Tinted>
          <Paragraph size="$5" fontWeight="400">{board.name}</Paragraph>
        </XStack>
        {/* <Tinted><Save color="var(--color8)" size={"$1"} strokeWidth={1.6}/></Tinted> */}
        <XStack f={1} alignItems='center' justifyContent='flex-end'>
          {
            isJSONView
              ? <Tinted>
                <XStack userSelect="none" ai="center" jc="center" mr="$5" gap="$3">
                  <Button
                    icon={X}
                    theme="red"
                    scaleIcon={1.2}
                    onPress={() => removeReplace('json')}
                  />
                  <Button
                    icon={Save}
                    scaleIcon={1.2}
                    onPress={onEditBoard}
                  />
                </XStack>
              </Tinted>
              : <Tinted>
                <XStack userSelect="none" ai="center" jc="center" mr="$5">
                  <XStack mr="$3">
                    <XStack opacity={rulesOpened ? 1.0 : 0.6} hoverStyle={{ opacity: 1 }} pressStyle={{ opacity: 0.8 }} cursor="pointer" onPress={() => {
                      setRulesOpened(!rulesOpened)
                    }}>
                      <Sparkles size={25} color={autopilot ? "var(--color9)" : "var(--gray8)"} />
                    </XStack>

                  </XStack>
                  <Paragraph size="$3" fontWeight="400" mr="$4">Autopilot</Paragraph>
                  <Switch size="$2" checked={autopilot} onCheckedChange={async (checked) => {
                    setAutopilot(checked)
                    boardRef.current.autopilot = checked
                    await API.get(`/api/core/v1/boards/${board.name}/autopilot/${checked ? 'on' : 'off'}`)
                  }}>
                    <Switch.Thumb animation="bouncy" />
                  </Switch>
                </XStack>

                <DataViewActionButton
                  icon={(props) => <Plus {...props} color="var(--color10)" />}
                  description="Add"
                  onPress={async () => {
                    setAddOpened(true)
                  }}
                />
              </Tinted>
          }
        </XStack>
      </XStack>

      <CardSelector addOpened={addOpened} setAddOpened={setAddOpened} onFinish={addWidget} states={states} icons={icons} actions={actions} />

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
            maxWidth={1400}
            minWidth={1400}
            minHeight={750}
          >
            <Dialog.Title>Edit</Dialog.Title>
            {currentCard && currentCard.type == 'value' && <ValueCardSettings states={states} icons={icons} card={currentCard} onEdit={(data) => {
              setEditedCard(data)
            }} />}
            {currentCard && currentCard.type == 'action' && <ActionCardSettings actions={actions} states={states} icons={icons} card={currentCard} onEdit={(data) => {
              setEditedCard(data)
            }} />}
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
      <AlertDialog
        acceptButtonProps={{ color: "white", backgroundColor: "$red9" }}
        p="$5"
        acceptCaption="Delete"
        setOpen={setIsDeleting}
        open={isDeleting}
        onAccept={async (seter) => {
          await deleteCard(currentCard)
        }}
        acceptTint="red"
        title={`Delete "${currentCard?.name}"`}
        description={"Are you sure you want to delete this card?"}
      >
      </AlertDialog>
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
                layouts={layouts}
                borderRadius={10}
                padding={10}
                backgroundColor="white"
                onLayoutChange={(layout, layouts) => {
                  if(breakpointCancelRef.current == breakpointRef.current) {
                    console.log('Layout change cancelled for breakpoint: ', breakpointRef.current)
                    breakpointCancelRef.current = null
                    return
                  }
                  console.log('programming layout change: ', breakpointRef.current)
                  clearInterval(dedupRef.current)
                  //small dedup to avoid multiple saves in a short time
                  dedupRef.current = setTimeout(() => {
                    console.log('Layout changed: ', breakpointRef.current)
                    boardRef.current.layouts[breakpointRef.current] = layout
                    API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                  }, 1000)
                }}
                onBreakpointChange={(bp) => {
                  clearInterval(dedupRef.current)
                  console.log('Breakpoint changed to: ', bp)
                  breakpointRef.current = bp
                  //after changing breakpoint a onLaoutChange is triggered but its not necessary to save the layout
                  breakpointCancelRef.current = bp
                }}
              />
          }
        </YStack>
        {
          <XStack position="fixed" animation="quick" right={rulesOpened ? 0 : -1000} top={130} width={810} height="80vh">
            <XStack width="100%" br={9} height={"100%"} position="absolute" top="0" left="0" backgroundColor={darkMode ? 'black' : 'white'} opacity={0.9}></XStack>
            <RulesSideMenu boardRef={boardRef} board={board} actions={actions} states={states}></RulesSideMenu>

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


  return (<AsyncView ready={boardData.status == 'loaded' && iconsData.status == 'loaded'}>
    <AdminPage title={params.board + " board"} workspace={workspace} pageSession={pageSession}>
          {boardData.status == 'error' && <ErrorMessage
            msg="Error loading board"
            details={board?.error?.result}
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
          rowIcon={BookOpen}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          onAdd={(data) => { router.push(`/boards/view?board=${data.name}`); return data }}
          name="Board"
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
              onPress={() => router.push(`/boards/view?board=${element.name}`)}
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