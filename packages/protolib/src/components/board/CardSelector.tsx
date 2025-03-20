import { YStack, XStack, Spacer, ScrollView, useThemeName } from '@my/ui'
import { AlertDialog } from '../../components/AlertDialog';
import { Slides } from '../../components/Slides'
import { TemplatePreview } from '../../bundles/pages/TemplatePreview';
import { useEffect, useState } from 'react';
import { ValueCardSettings } from '../autopilot/ValueCardSettings';
import { ActionCardSettings } from '../autopilot/ActionCardSettings';
import { useProtoStates } from '../../bundles/protomemdb/lib/useProtoStates'
const SelectGrid = ({ children }) => {
  return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
    {children}
  </XStack>
}

const FirstSlide = ({ selected, setSelected, options }) => {
  const themeName = useThemeName();
  return <YStack>
    <ScrollView mah={"500px"}>
      <SelectGrid>
        {options.map((option) => (
          <TemplatePreview
            from="boards"
            theme={themeName}
            template={option}
            isSelected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </SelectGrid>
    </ScrollView>
    <Spacer marginBottom="$8" />
  </YStack>
}

const iconTable = {
  'value': 'tag',
  'action': 'zap'
}

const SecondSlide = ({ defaults, card, selected, states, icons, actions, setCard }) => {
  const emptyCard = { key: "key", type: selected, width: 2, height: 6, name: selected, icon: iconTable[selected] }
  return <YStack>
      {selected == "value" ?
        <ValueCardSettings states={states} icons={icons} card={{...defaults[card.type], ...emptyCard}} onEdit={(data) => {
          setCard(data)
        }}/> :
        <ActionCardSettings states={states} icons={icons} card={{...defaults[card.type], ...emptyCard}} actions={actions} onEdit={(data) => {
          setCard(data)
        }}/>}
  </YStack>
}

const cards = [{
  name: 'Display value',
  id: 'value'
},
{
  name: 'Invoques an action',
  id: 'action'
}]
function flattenTree(obj) {
  let leaves = [];

  function traverse(node) {
      if (node && typeof node === 'object') {
          if (node.type) {
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
const useCards = () => {
  const availableCards = useProtoStates({}, 'cards/#', 'cards')
  return flattenTree(availableCards)
}

export const CardSelector = ({ defaults={}, addOpened, setAddOpened, onFinish, states, icons, actions }) => {
  const availableCards = useCards()

  console.log('availableCards', availableCards)
  const [selectedCard, setSelectedCard] = useState('value')
  const [card, setCard] = useState({ key: "key", type:selectedCard, width: 2, height: 6, name: selectedCard, icon: iconTable[selectedCard] })

  useEffect(() => {
    setCard({ key: "key", type:selectedCard, width: 2, height: 6, name: selectedCard, icon: iconTable[selectedCard] })
  }, [selectedCard])
  return <AlertDialog
    integratedChat
    p={"$2"}
    pt="$5"
    pl="$5"
    setOpen={setAddOpened}
    open={addOpened}
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
              component: <SecondSlide defaults={defaults} selected={selectedCard} states={states} icons={icons} actions={actions} card={card} setCard={setCard} />
            }
          ]
          }></Slides>
      </XStack>
      {/* </ScrollView> */}
    </YStack>
  </AlertDialog>
}