import { BookOpen, BookOpenText, ExternalLink, Cog, Palette, Plus, Settings, Tag, Trash2, Type } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API } from 'protobase'
import { DataTable2 } from "../../components/DataTable2"
import { DataView, DataViewActionButton } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import ErrorMessage from "../../components/ErrorMessage"
import { YStack, XStack, Paragraph, Button as TamaButton, Dialog, Stack, Input, Label } from '@my/ui'
import { computeLayout } from '../autopilot/layout';
import { DashboardGrid } from '../../components/DashboardGrid';
import { AlertDialog } from '../../components/AlertDialog';
import { CardValue, CenterCard } from '../widgets'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from '../../components/Tinted'
import React from 'react'
import { InputColor } from '../../components/InputColor'
import { RuleEditor } from '../../components/autopilot/RuleEditor'
import { useProtoStates } from '../protomemdb/lib/useProtoStates'
import { CardSelector } from '../../components/board/CardSelector'
import { InteractiveIcon } from '../../components/InteractiveIcon'
import { IconSelect } from '../../components/IconSelect'
import { ActionRunner } from '../../components/ActionRunner'
import { ValueCardSettings } from '../../components/autopilot/ValueCardSettings'

const sourceUrl = '/api/core/v1/boards'

export const ActionCardSettings = ({ actions, states, card, icons, onEdit = (data) => { } }) => {
  const [cardData, setCardData] = useState(card);
  useEffect(() => {
    onEdit(cardData);
  }, [cardData, onEdit]);

  return (
    <YStack space="$4" padding="$4">
      <Tinted>
        <XStack alignItems="center" space="$8" width="100%">
          <YStack flex={1}>
            <Label size={"$5"}> <Type color={"$color8"} mr="$2" />Name</Label>
            <Input
              value={cardData.name}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  name: e.target.value,
                })
              }
            />
          </YStack>
          <YStack flex={1}>
            <XStack alignItems="center" space="$2">
              <Label size={"$5"}><BookOpenText color={"$color8"} mr="$2" />Icon</Label>

            </XStack>
            <XStack alignItems="center" space="$2">
              <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">
                <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
              </a>
              <IconSelect
                icons={icons}
                onSelect={(icon) => {
                  setCardData({
                    ...cardData,
                    icon,
                  });
                }}
                selected={cardData.icon}
              />
            </XStack>

          </YStack>
          <YStack flex={1}>
            <Label size={"$5"}><Palette color={"$color8"} mr="$2" />Color</Label>
            <InputColor
              color={cardData.color}
              onChange={(e) =>
                setCardData({ ...cardData, color: e.hex })
              }
            />
          </YStack>
        </XStack>

        <YStack mt="$5" height={600}>
          <Label mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Actions</Label>
          <RuleEditor
            states={actions}
            cardData={cardData}
            setCardData={setCardData}
          />
        </YStack>
      </Tinted>
    </YStack>
  );
};


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

  const availableCards = [{
    name: 'Display value',
    id: 'value'
  },
  {
    name: 'Invoques an action',
    id: 'action'
  }]

  const states = useProtoStates({}, 'states/boards/' + board.name + '/#', 'states')
  const actions = useProtoStates({}, '#', 'actions')

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
  }, [states])

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

  const editCard = (card) => async () => {
    console.log("Edit card: ", card)
  }

  const layouts = {
    lg: computeLayout(items, { totalCols: 12, normalW: 2, normalH: 6, doubleW: 6, doubleH: 12 }, { layout: board?.layouts?.lg }),
    md: computeLayout(items, { totalCols: 10, normalW: 10, normalH: 12, doubleW: 10, doubleH: 12 }, { layout: board?.layouts?.md }),
    sm: computeLayout(items, { totalCols: 12, normalW: 12, normalH: 6, doubleW: 12, doubleH: 12 }, { layout: board?.layouts?.sm })
  }

  const iconTable = {
    'value': 'tag',
    'action': 'zap'
  }

  const addWidget = async (type) => {
    const rnd = Math.floor(Math.random() * 100000)
    const newItems = [...items, { key: type + '_' + rnd, type, width: 1, height: 6, name: type, icon: iconTable[type] }].filter(item => item.key != 'addwidget')
    setItems(newItems)
    boardRef.current.cards = newItems
    API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
  }

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
        }} onRun={(key, params) => {
          console.log('Running action: ', key, params);
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
          <DataViewActionButton
            icon={Plus}
            description="Add"
            onPress={async () => {
              setAddOpened(true)
            }}
          />
        </XStack>

      </XStack>

      <CardSelector cards={availableCards} addOpened={addOpened} setAddOpened={setAddOpened} onFinish={addWidget} />

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