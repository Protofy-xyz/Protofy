import { BookOpen, BookOpenText, ExternalLink, HelpCircle, Plus, Save, Settings, Tag, Trash2 } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, set } from 'protobase'
import { DataTable2 } from "../../components/DataTable2"
import { DataView } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import ErrorMessage from "../../components/ErrorMessage"
import { YStack, XStack, Paragraph, Popover, Button as TamaButton, Dialog, Stack, Card, Input } from '@my/ui'
import { computeLayout } from '../autopilot/layout';
import { DashboardGrid } from '../../components/DashboardGrid';
import { AlertDialog } from '../../components/AlertDialog';
import { CardValue, CenterCard } from '../widgets'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { Tinted } from '../../components/Tinted'
import React from 'react'
import { InputColor } from '../../components/InputColor'
import Select from "react-select";

const IconSelect = ({ icons, onSelect, selected }) => {
  const [selectedIcon, setSelectedIcon] = useState(
    selected ? { value: selected, label: selected } : null
  );

  // Convertimos los iconos a un formato compatible con react-select
  const options = icons.map((icon) => ({
    value: icon,
    label: icon,
  }));

  return (
    <div>
      <Select
        options={options}
        components={{
          SingleValue: ({ data }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center", // 🔥 Centra verticalmente el contenido
                gap: "8px",
                padding: "0px 4px", // 🔥 Ajusta el padding interno
              }}
            >
              <img
                src={`/public/icons/${data.value}.svg`}
                alt={data.value}
                width={18}
                height={18}
                style={{ verticalAlign: "middle" }} // 🔥 Asegura la alineación del icono
              />
              {data.value}
            </div>
          ),
        }}
        onChange={(selectedOption) => {
          setSelectedIcon(selectedOption);
          onSelect?.(selectedOption.value);
        }}
        value={selectedIcon}
        placeholder="Select an icon..."
        menuPlacement="auto"
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: "36px", // 🔥 Mantiene altura de input normal
            height: state.menuIsOpen || state.isFocused ? "auto" : "36px", // 🔥 Se expande al abrir
            transition: "all 0.2s ease-in-out",
            display: "flex",
            alignItems: "center", // 🔥 Asegura que el contenido se mantenga centrado
          }),
          valueContainer: (provided) => ({
            ...provided,
            display: "flex",
            alignItems: "center", // 🔥 Centra el contenido dentro de la caja
            padding: "2px 8px", // 🔥 Ajusta el padding interno
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 99999,
          }),
        }}
        maxMenuHeight={300}
      />
    </div>
  );
}

const sourceUrl = '/api/core/v1/boards'

const CardSettings = ({ card, icons, onEdit = (data) => { } }) => {
  const [cardData, setCardData] = useState(card);
  useEffect(() => {
    onEdit(cardData);
  }, [cardData]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "15px 15px",
        alignItems: "center",
        padding: "10px",
      }}
    >
      {/* Title Field */}
      <label
        style={{
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        Title
      </label>
      <Input
        value={cardData.name}
        onChange={(e) =>
          setCardData({
            ...cardData,
            name: e.target.value,
          })
        }
      />

      {/* Icon Field */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        <span>Icon</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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

        <a style={{ marginLeft: '20px' }} href="https://lucide.dev/icons/" target="_blank">
          <BookOpenText opacity={0.6} />
        </a>
      </div>

      {/* Color Field */}
      <label
        style={{
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        Color
      </label>
      <div style={{ zIndex: 1000 }}>
        <InputColor color={cardData.color} onChange={(e) => setCardData({ ...cardData, color: e.hex })} />
      </div>

    </div>
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

const getCardValue = (card, states) => {
  //TODO: implement this
  return undefined
}

const Board = ({ board, icons }) => {
  const states = {} // TODO: get states from protomemdb
  const addCard = { key: 'addwidget', type: 'addWidget', width: 1, height: 6 }
  const [items, setItems] = useState((board.cards ? [...board.cards] : [addCard]).sort((a, b) => a.key == 'addwidget' ? 1 : -1))
  const [addOpened, setAddOpened] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [editedCard, setEditedCard] = useState(null)

  const boardRef = React.useRef(board)

  const deleteCard = async (card) => {
    const newItems = items.filter(item => item.key != card.key)
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
    md: computeLayout(items, { totalCols: 10, normalW: 5, normalH: 6, doubleW: 10, doubleH: 12 }, { layout: board?.layouts?.md }),
    sm: computeLayout(items, { totalCols: 12, normalW: 12, normalH: 6, doubleW: 12, doubleH: 12 }, { layout: board?.layouts?.sm })
  }

  const addWidget = async (type) => {
    const rnd = Math.floor(Math.random() * 100000)
    const newItems = [...items, { key: type + '_' + rnd, type, width: 1, height: 6, name: type }].sort((a, b) => a.key == 'addwidget' ? 1 : -1)
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
        content: <ValueCard color={item.color} icon={item.icon ? '/public/icons/' + item.icon + '.svg' : undefined} id={item.key} title={item.name} value={getCardValue(item, states)} onDelete={() => {
          setIsDeleting(true)
          setCurrentCard(item)
        }} onEdit={() => {
          setIsEditing(true)
          setCurrentCard(item)
          setEditedCard(item)
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
      </XStack>
      <Dialog modal open={addOpened} onOpenChange={setAddOpened}>
        <Dialog.Portal zIndex={1} overflow='hidden'>
          <Dialog.Overlay />
          <Dialog.Content
            bordered
            elevate
            animateOnly={['transform', 'opacity']}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            maxWidth={600}
          >
            <Dialog.Title>Add...</Dialog.Title>
            <Dialog.Description>
              {'Select the widget you want to add to the board'}
            </Dialog.Description>
            <YStack height={300} width={600}>
              TODO: widget type selector
            </YStack>
            <Dialog.Close displayWhenAdapted asChild>
              <Tinted><TamaButton onPress={async () => {
                await addWidget('value')
                setAddOpened(false)
              }}>
                Add
              </TamaButton></Tinted>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      <Dialog modal open={isEditing} onOpenChange={setIsEditing}>
        <Dialog.Portal zIndex={1} overflow='hidden'>
          <Dialog.Overlay />
          <Dialog.Content
            bordered
            elevate
            animateOnly={['transform', 'opacity']}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
            maxWidth={600}
          >
            <Dialog.Title>Edit</Dialog.Title>
            {currentCard && <CardSettings icons={icons} card={currentCard} onEdit={(data) => {
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