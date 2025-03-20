import { YStack, XStack, Spacer, ScrollView, useThemeName, Input } from '@my/ui'
import { AlertDialog } from '../../components/AlertDialog';
import { Slides } from '../../components/Slides'
import { TemplatePreview } from '../../bundles/pages/TemplatePreview';
import { useEffect, useMemo, useState } from 'react';
import { ValueCardSettings } from '../autopilot/ValueCardSettings';
import { ActionCardSettings } from '../autopilot/ActionCardSettings';
import { useProtoStates } from '../../bundles/protomemdb/lib/useProtoStates'
import { AlignLeft, Braces, Copy, Search } from "@tamagui/lucide-icons";

const SelectGrid = ({ children }) => {
  return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
    {children}
  </XStack>
}

const FirstSlide = ({ selected, setSelected, options }) => {
  const themeName = useThemeName()
  const [search, setSearch] = useState('')

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
            <TemplatePreview
              key={option.id}
              from="boards"
              theme={themeName}
              template={option}
              isSelected={selected?.id === option.id}
              onPress={() => setSelected(option)}
            />
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
  return <YStack>
      {card?.type == "value" ?
        <ValueCardSettings states={states} icons={icons} card={card} onEdit={(data) => {
          setCard(data)
        }}/> :
        <ActionCardSettings states={states} icons={icons} card={card} actions={actions} onEdit={(data) => {
          setCard(data)
        }}/>}
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
const useCards = (extraCards =[]) => {
  const availableCards = useProtoStates({}, 'cards/#', 'cards')
  return [...extraCards, ...flattenTree(availableCards)]
}

export const CardSelector = ({ defaults={}, addOpened, setAddOpened, onFinish, states, icons, actions }) => {
  const cards = useCards(extraCards)
  const [selectedCard, setSelectedCard] = useState()
  const [card, setCard] = useState()

  useEffect(() => {
    if(selectedCard) {
      setCard({ key: "key", width: 2, height: 6, icon: iconTable[selectedCard.defaults.type], html: typeCodes[selectedCard.defaults.type] , ...selectedCard.defaults })
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