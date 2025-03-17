import { BookOpen, Bot, Plus, Settings, Sparkles, Tag, Trash2 } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, set } from 'protobase'
import { DataTable2 } from "../../components/DataTable2"
import { DataView, DataViewActionButton } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import ErrorMessage from "../../components/ErrorMessage"
import { YStack, XStack, Paragraph, Button as TamaButton, Dialog, Stack, Switch, ToggleGroup, Button } from '@my/ui'
import { computeLayout } from '../autopilot/layout';
import { DashboardGrid } from '../../components/DashboardGrid';
import { AlertDialog } from '../../components/AlertDialog';
import { CardValue, CenterCard } from '../widgets'
import { useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from '../../components/Tinted'
import React from 'react'
import { useProtoStates } from '../protomemdb/lib/useProtoStates'
import { CardSelector } from '../../components/board/CardSelector'
import { ActionRunner } from '../../components/ActionRunner'
import { ValueCardSettings } from '../../components/autopilot/ValueCardSettings'
import { ActionCardSettings } from '../../components/autopilot/ActionCardSettings'
import { Rules } from '../../components/autopilot/Rules'
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from '../../components/Monaco'

const sourceUrl = '/api/core/v1/boards'

const CardIcon = ({ Icon, onPress }) => {
  return <Tinted>
    <XStack right={-10} hoverStyle={{ bg: '$backgroundFocus' }} pressStyle={{ bg: '$backgroundPress' }} borderRadius="$5" alignItems="center" justifyContent="center" cursor="pointer" p="$2" onPress={onPress}>
      <Icon size={20} onPress={onPress} />
    </XStack>
  </Tinted>
}

const CardActions = ({ id, onEdit, onDelete }) => {
  return <Tinted>
    <XStack>
      <CardIcon Icon={Trash2} onPress={onDelete} />
      <CardIcon Icon={Settings} onPress={onEdit} />
    </XStack>
  </Tinted>
}

const ValueCard = ({ id, title, value, icon = undefined, color, onDelete = () => { }, onEdit = () => { } }) => {
  return <CenterCard title={title} id={id} cardActions={<CardActions id={id} onDelete={onDelete} onEdit={onEdit} />} >
    <CardValue
      Icon={icon ?? Tag}
      value={value ?? 'N/A'}
      color={color}
    />
  </CenterCard>
}

const ActionCard = ({ id, name, title, params, icon = undefined, color, onRun = (name, params) => { }, onDelete = () => { }, onEdit = () => { } }) => {
  return <CenterCard title={title} id={id} cardActions={<CardActions id={id} onDelete={onDelete} onEdit={onEdit} />} >
    <ActionRunner
      name={name}
      description={"Run action"}
      actionParams={params}
      onRun={onRun}
      icon={icon}
      color={color}
    />
  </CenterCard>
}

const Board = ({ board, icons }) => {
  const addCard = { key: 'addwidget', type: 'addWidget', width: 1, height: 6 }
  const [items, setItems] = useState((board.cards && board.cards.length ? [...board.cards.filter(key => key != 'addwidget')] : [addCard]))
  const [addOpened, setAddOpened] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [editedCard, setEditedCard] = useState(null)
  const [autopilot, setAutopilot] = useState(board.autopilot)
  const [rulesOpened, setRulesOpened] = useState(false)
  const [tab, setTab] = useState("rules");
  const { resolvedTheme } = useThemeSetting();
  const [savedRules, setSavedRules] = useState(board.rules)
  const [savedCode, setSavedCode] = useState(board.rulesCode)

  const availableCards = [{
    name: 'Display value',
    id: 'value'
  },
  {
    name: 'Invoques an action',
    id: 'action'
  }]

  const states = useProtoStates({}, 'states/boards/' + board.name + '/#', 'states')
  const actions = useProtoStates({}, null, 'actions')

  const reloadBoard = async () => {
    const dataData = await API.get(`/api/core/v1/boards/${board.name}`)
    if (dataData.status == 'loaded') {
      let newItems = dataData.data?.cards
      if (!newItems || newItems.length == 0) newItems = [addCard]
      setItems(newItems)
    }
  }

  useUpdateEffect(() => {
    console.log('///////////////////////////////////////////////////////')
    console.log('Board states: ', states)
    console.log('///////////////////////////////////////////////////////')
    reloadBoard()
  }, [states, actions])

  const boardRef = React.useRef(board)

  const deleteCard = async (card) => {
    const newItems = items.filter(item => item.key != card.key)
    if (newItems.length == 0) newItems.push(addCard)
    setItems(newItems)
    boardRef.current.cards = newItems
    await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
    setIsDeleting(false)
    setCurrentCard(null)
  }

  const layouts = {
    lg: computeLayout(items, { totalCols: 12, normalW: 2, normalH: 6, doubleW: 6, doubleH: 12 }, { layout: board?.layouts?.lg }),
    md: computeLayout(items, { totalCols: 10, normalW: 10, normalH: 12, doubleW: 10, doubleH: 12 }, { layout: board?.layouts?.md }),
    sm: computeLayout(items, { totalCols: 12, normalW: 12, normalH: 6, doubleW: 12, doubleH: 12 }, { layout: board?.layouts?.sm })
  }

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

  //fill items with react content, addWidget should be the last item
  const cards = items.map((item) => {
    if (item.type == 'addWidget') {
      return {
        ...item,
        content: <CenterCard title={""} id={item.key}>
          <YStack alignItems="center" justifyContent="center" f={1} width="100%" opacity={1}>
            <YStack p="$2" pressStyle={{ bg: '$backgroundPress' }} borderRadius="$5" hoverStyle={{ bg: '$backgroundHover' }} alignItems='center' justifyContent='center' className="no-drag" cursor="pointer" onPress={() => {
              setAddOpened(true)
            }}>
              <Stack alignItems="center" justifyContent="center" opacity={0.5} hoverStyle={{ opacity: 0.75 }} pressStyle={{ opacity: 0.9 }}>
                <Plus size={50} />
                <Paragraph size="$5" fontWeight="400" mt="$1">Add</Paragraph>
              </Stack>

            </YStack>
          </YStack>
        </CenterCard>
      }
    } else if (item.type == 'value') {
      return {
        ...item,
        content: <ValueCard color={item.color} icon={item.icon ? '/public/icons/' + item.icon + '.svg' : undefined} id={item.key} title={item.name} value={item.value ?? 'N/A'} onDelete={() => {
          setIsDeleting(true)
          setCurrentCard(item)
        }} onEdit={() => {
          setIsEditing(true)
          setCurrentCard(item)
          setEditedCard(item)
        }} />
      }
    } else if (item.type == 'action') {
      return {
        ...item,
        content: <ActionCard name={item.name} color={item.color} icon={item.icon ? '/public/icons/' + item.icon + '.svg' : undefined} id={item.key} title={item.name} params={item.params} onDelete={() => {
          setIsDeleting(true)
          setCurrentCard(item)
        }} onEdit={() => {
          setIsEditing(true)
          setCurrentCard(item)
          setEditedCard(item)
        }} onRun={async (name, params) => {
          const paramsStr = Object.keys(params ?? {}).map(key => key + '=' + params[key]).join('&')
          await API.get(`/api/core/v1/boards/${board.name}/actions/${name}?${paramsStr}`)
        }} />
      }
    }
    return item
  })

  return (
    <YStack flex={1}>
      <XStack px={"$5"} py={"$3"}>
        <Paragraph size="$5" fontWeight="400">{board.name}</Paragraph>
        {/* <Tinted><Save color="var(--color8)" size={"$1"} strokeWidth={1.6}/></Tinted> */}
        <XStack f={1} alignItems='center' justifyContent='flex-end'>
          <Tinted>
            <XStack ai="center" jc="center" mr="$5">
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
        </XStack>
      </XStack>

      <CardSelector cards={availableCards} addOpened={addOpened} setAddOpened={setAddOpened} onFinish={addWidget} states={states} icons={icons} actions={actions} />

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
        title={"Delete: " + currentCard?.title}
        description={"Are you sure you want to delete this card?"}
      >
      </AlertDialog>
      <XStack f={1}>
        <YStack f={1}>
          <DashboardGrid
            items={cards}
            layouts={layouts}
            borderRadius={10}
            padding={10}
            backgroundColor="white"
            onLayoutChange={(layout, layouts) => {
              boardRef.current.layouts = layouts
              API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
            }}
          />
        </YStack>
        {
          rulesOpened && <YStack height="90%" w="600px" backgroundColor="$bgPanel" p="$3" btlr={9} bblr={9}>
            <Tinted>
              {/* Toggle de Tabs */}
              <XStack width="100%" pt="$0" pr="$1" pb="$2" jc="center">
                <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                  <ToggleGroup.Item value="rules">rules</ToggleGroup.Item>
                  <ToggleGroup.Item value="code">code</ToggleGroup.Item>
                </ToggleGroup>
              </XStack>
              {(tab == 'rules' || !tab) && (
                <YStack flex={1}>
                  <Rules
                    rules={savedRules ?? []}
                    onAddRule={(e, rule) => {
                      setSavedRules([...(savedRules ?? []), rule])
                    }}
                    onDeleteRule={(index) => {
                      setSavedRules(savedRules.filter((_, i) => i != index))
                    }}
                    loadingIndex={-1}
                  />
                  <YStack mt="auto" pt="$3">
                    <Button onPress={async () => {
                      boardRef.current.rules = savedRules
                      const rulesCode = await API.post(`/api/core/v1/autopilot/getBoardCode`, { rules: savedRules, states, actions })
                      if(rulesCode.status == 'loaded') {
                        setSavedCode(rulesCode.data.jsCode)
                      }
                      boardRef.current.rulesCode = savedCode
                      await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)

                      // boardRef.current.rules = []
                      // await API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                    }}>
                      Save
                    </Button>
                  </YStack>
                </YStack>
              )}

              {tab == 'code' && (
                <YStack flex={1}>
                  <Monaco
                    path={'rules.ts'}
                    darkMode={resolvedTheme === 'dark'}
                    sourceCode={boardRef.current?.rulesCode}
                    onChange={(text) => {
                      setSavedCode(text)
                    }}
                  />
                  <YStack mt="auto" pt="$3">
                    <Button onPress={() => {
                      boardRef.current.rulesCode = savedCode
                      API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                    }}>
                      Save Code
                    </Button>
                  </YStack>
                </YStack>
              )}
            </Tinted>
          </YStack>

        }
      </XStack>

    </YStack>
  )
}

export default {
  boards: {
    component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
      return (<AdminPage title="Boards" workspace={workspace} pageSession={pageSession}>
        <DataView
          entityName={"boards"}
          itemData={itemData}
          rowIcon={BookOpen}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="Board"
          onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
          columns={DataTable2.columns(
            DataTable2.column("name", row => row.name, "name")
          )}
          model={BoardModel}
          pageState={pageState}
          dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  },
  view: {
    component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData, board, icons }: any) => {
      const { data } = board
      return (<AdminPage title="Board" workspace={workspace} pageSession={pageSession}>
        {board.status == 'error' && <ErrorMessage
          msg="Error loading board"
          details={board.error.result}
        />}
        {board.status == 'loaded' && <Board board={data} icons={icons} />}
      </AdminPage>)
    },
    getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async () => {
      return {
        board: await API.get(`/api/core/v1/boards/${context.params.board}`),
        icons: (await API.get('/api/core/v1/icons'))?.data?.icons ?? []
      }
    }))
  }
}