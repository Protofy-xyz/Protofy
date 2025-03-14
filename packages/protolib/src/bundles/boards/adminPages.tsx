import { BookOpen, BookOpenText, ExternalLink, HelpCircle, Plus, Save, Settings, Tag, Trash2 } from '@tamagui/lucide-icons'
import { BoardModel } from './boardsSchemas'
import { API, set } from 'protobase'
import { DataTable2 } from "../../components/DataTable2"
import { DataView, DataViewActionButton } from "../../components/DataView"
import { AdminPage } from "../../components/AdminPage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import ErrorMessage from "../../components/ErrorMessage"
import { YStack, XStack, Paragraph, Popover, Button as TamaButton, Dialog, Stack, Card, Input, Spacer } from '@my/ui'
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
import { AutopilotEditor } from '../../components/autopilot/AutopilotEditor'
import { useProtoStates } from '../protomemdb/lib/useProtoStates'
import { CardSelector } from '../../components/board/CardSelector'

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
    <div style={{ flex: 1 }}>
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

const RuleEditor = ({ states, cardData, setCardData }) => {
  const [hasCode, setHasCode] = useState(cardData.rulesCode !== undefined)
  const [value, setValue] = useState()

  const getRulesCode = async (force?) => {
    if (!hasCode || force) {
      setHasCode(false)
      const code = await API.post('/api/core/v1/autopilot/getValueCode', { states, rules: cardData.rules })
      if (!code?.data?.jsCode) return
      setCardData({
        ...cardData,
        rulesCode: code.data.jsCode
      })
      setHasCode(true)
    }
  }

  useEffect(() => {
    getRulesCode()
  }, [])

  useEffect(() => {
    if (cardData.rulesCode) {
      console.log('new rules code, executing...', cardData.rulesCode, states)
      const wrapper = new Function('states', `
        ${cardData.rulesCode}
        return reduce_state_obj(states);
      `);
      let value = wrapper(states);
      console.log('got value: ', value)
      setValue(value)
    }
  }, [cardData.rulesCode])

  useUpdateEffect(() => {
    getRulesCode(true)
  }, [cardData.rules])

  return <AutopilotEditor data={states} rules={cardData.rules ?? []} value={value} onDeleteRule={(index) => {
    setCardData({
      ...cardData,
      rules: cardData.rules?.filter((_, i) => i !== index)
    });
  }} onAddRule={(e, rule) => {
    setCardData({
      ...cardData,
      rules: cardData.rules ? [...cardData.rules, rule] : [rule]
    });
  }} valueReady={hasCode} />
}

const CardSettings = ({ states, card, icons, onEdit = (data) => { } }) => {
  const [cardData, setCardData] = useState(card);

  useEffect(() => {
    onEdit(cardData);
  }, [cardData]);

  return (
    <div>
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
      <div style={{ height: "600px" }}>
        <RuleEditor states={states} cardData={cardData} setCardData={setCardData} />
      </div>
      {/* <Spacer height={900} /> */}
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
  if (!card.rulesCode) return
  //TODO: implement this
  const wrapper = new Function('states', `
    ${card.rulesCode}
    return reduce_state_obj(states);
  `);
  let value
  try {
    value = wrapper(states);
    if (Object.keys(value).length == 1) {
      value = value[Object.keys(value)[0]]
    }
  } catch (e) {
    console.error('Error executing rules code: ', e)
    console.error('Rules code: ', card.rulesCode)
  }

  return value
}

const Board = ({ board, icons }) => {
  const addCard = { key: 'addwidget', type: 'addWidget', width: 1, height: 6 }
  const [items, setItems] = useState((board.cards && board.cards.length ? [...board.cards.filter(key => key != 'addwidget')] : [addCard]))
  const [addOpened, setAddOpened] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCard, setCurrentCard] = useState(null)
  const [editedCard, setEditedCard] = useState(null)

  const [selectedCard, setSelectedCard] = useState('value')
  const availableCards = [{
    name: 'value'
  },
  {
    name: 'action'
  }]

  const states = useProtoStates({})

  useEffect(() => {
    console.log('///////////////////////////////////////////////////////')
    console.log('Board states: ', states)
    console.log('///////////////////////////////////////////////////////')
  }, [states])

  const boardRef = React.useRef(board)

  const deleteCard = async (card) => {
    const newItems = items.filter(item => item.key != card.key)
    if(newItems.length == 0) newItems.push(addCard)
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

  const addWidget = async (type) => {
    const rnd = Math.floor(Math.random() * 100000)
    const newItems = [...items, { key: type + '_' + rnd, type, width: 1, height: 6, name: type }].filter(item => item.key != 'addwidget')
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
            <CardSelector cards={availableCards} selectedCard={selectedCard} onSelectCard={(card) => setSelectedCard(card)}/>
            <Dialog.Close displayWhenAdapted asChild>
              <Tinted><TamaButton onPress={async () => {
                await addWidget(selectedCard)
                setSelectedCard('value')
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
            maxWidth={1200}
            minWidth={1100}
            minHeight={750}
          >
            <Dialog.Title>Edit</Dialog.Title>
            {currentCard && <CardSettings states={states} icons={icons} card={currentCard} onEdit={(data) => {
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