import { YStack, XStack, Spacer, ScrollView, useThemeName, Input, Text } from '@my/ui'
import { AlertDialog } from '../../components/AlertDialog';
import { Slides } from '../../components/Slides'
import { useEffect, useMemo, useState } from 'react';
import { ValueCardSettings } from '../autopilot/ValueCardSettings';
import { ActionCardSettings } from '../autopilot/ActionCardSettings';
import { useProtoStates } from '@extensions/protomemdb/lib/useProtoStates'
import { AlignLeft, Braces, Copy, Search, ArrowBigDownDash, Activity } from "@tamagui/lucide-icons";
import { Tinted } from '../Tinted';
import { getIconUrl } from '../IconSelect';

const SelectGrid = ({ children }) => {
  return <XStack jc="flex-start" ai="center" gap={25} flexWrap='wrap'>
    {children}
  </XStack>
}

const FirstSlide = ({ selected, setSelected, options }) => {
  const themeName = useThemeName()
  const [search, setSearch] = useState('')
  const isAction = (option) => option.defaults?.type === 'action'

  const filteredOptions = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return options.filter(opt => {
      return opt.name?.toLowerCase().includes(lowerSearch)
    })
  }, [options, search])

  return (
    <YStack>
      <XStack pb={8} mt={-15} mb={15} position="relative">
        <Search pos="absolute" left="$3" top={14} size={16} pointerEvents="none" />
        <Input
          bg="$gray1"
          color="$gray12"
          paddingLeft="$7"
          bw={0}
          h="47px"
          boc="$gray6"
          w="100%"
          placeholder="search..."
          placeholderTextColor="$gray9"
          outlineColor="$gray8"
          value={search}
          onChangeText={setSearch}
        />
      </XStack>

      <ScrollView mah="500px" minHeight={500}>
        <SelectGrid>
          {filteredOptions.map((option) => (
            <Tinted>
              <XStack
                w={420}
                key={option.id}
                gap={"$2"}
                p={"$2"}
                cursor="pointer"
                onPress={() => setSelected(option)}
                borderRadius={"$3"}
                ai="center"
                bc={selected?.id === option.id ? "$color4" : "$gray3"}
                bw={"1px"}
                boc={selected?.id === option.id ? "$color7" : "$gray5"}
                hoverStyle={{ bc: "$color4", boc: "$color7" }}
              >
                <YStack br={isAction(option) ? "$10" : "$2"} p={"$2"} bc={option?.defaults?.color ? option?.defaults?.color : isAction(option) ? "$yellow7" : "$blue7"} >
                  {
                    option?.defaults?.icon
                      ? <img
                        src={getIconUrl(option.defaults.icon)}
                        width={20}
                        height={20}
                      />
                      :
                      isAction(option)
                        ? <ArrowBigDownDash />
                        : <Activity />
                  }
                </YStack>
                <Text fow={selected?.id === option.id && "600"} >{option.name}</Text>
              </XStack>
            </Tinted>
          ))}
        </SelectGrid>
      </ScrollView>

      <Spacer marginBottom="$8" />
    </YStack>
  )
}


const iconTable = {
  'value': 'tag',
  'action': 'zap'
}

const SecondSlide = ({ card, selected, states, icons, actions, setCard }) => {
  return <YStack mb={"$4"}>
    {card?.type == "value" ?
      <ValueCardSettings states={states} icons={icons} card={card} onEdit={(data) => {
        setCard(data)
      }} /> :
      <ActionCardSettings states={states} icons={icons} card={card} actions={actions} onEdit={(data) => {
        setCard(data)
      }} />}
  </YStack>
}

const typeCodes = {
  value: `
//data contains: data.value, data.icon and data.color
return card({
    content: \`
        \${icon({ name: data.icon, color: data.color, size: '48' })}    
        \${cardValue({ value: data.value })}
    \`
});
`,
  action: `
// data contains: data.icon, data.color, data.name, data.params
return card({
    content: \`
        \${icon({ name: data.icon, color: data.color, size: '48' })}
        \${cardAction({ data })}
    \`
});
`
}

const extraCards = [{
  defaults: {
    type: 'value'
  },
  name: 'Display value',
  id: 'value'
},
{
  defaults: {
    type: 'action'
  },
  name: 'Invoques an action',
  id: 'action'
}]

function flattenTree(obj) {
  let leaves = [];

  function traverse(node) {
    if (node && typeof node === 'object') {
      if (node.name) {
        // Es una hoja, la añadimos al resultado
        leaves.push(node);
      } else {
        // Recorremos las propiedades del nodo
        Object.values(node).forEach(traverse);
      }
    }
  }

  traverse(obj);
  return leaves;
}
const useCards = (extraCards = []) => {
  const availableCards = useProtoStates({}, 'cards/#', 'cards')
  return [...extraCards, ...flattenTree(availableCards)]
}

export const CardSelector = ({ defaults = {}, addOpened, setAddOpened, onFinish, states, icons, actions }) => {
  const cards = useCards(extraCards)
  const [selectedCard, setSelectedCard] = useState(cards[0])
  const [card, setCard] = useState()

  useEffect(() => {
    if (selectedCard) {
      setCard({ key: "key", width: 2, height: 6, icon: iconTable[selectedCard.defaults.type], html: typeCodes[selectedCard.defaults.type], ...selectedCard.defaults })
    } else {
      setCard(undefined)
    }
  }, [selectedCard])
  return <AlertDialog
    integratedChat
    p={"$2"}
    pt="$5"
    pl="$5"
    setOpen={setAddOpened}
    open={addOpened}
    onFinish={() => setCard(undefined)}
    hideAccept={true}
    description={""}
  >
    <YStack f={1} jc="center" ai="center" >
      <XStack mr="$5" >
        <Slides
          styles={{ w: 1400, mah: "100vh" }}
          lastButtonCaption="Create"
          onFinish={async () => {
            await onFinish(card)
            setAddOpened(false)
          }}
          slides={[
            {
              name: "Create new widget",
              title: "Select the widget",
              component: <FirstSlide options={cards} selected={selectedCard} setSelected={setSelectedCard} />
            },
            {
              name: "Configure your widget",
              title: "Configure your widget",
              component: <SecondSlide states={states} icons={icons} actions={actions} card={card} setCard={setCard} />
            }
          ]
          }></Slides>
      </XStack>
      {/* </ScrollView> */}
    </YStack>
  </AlertDialog>
}