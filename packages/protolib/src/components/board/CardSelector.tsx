import { YStack, XStack, Spacer, ScrollView, useThemeName } from '@my/ui'
import { AlertDialog } from '../../components/AlertDialog';
import { Slides } from '../../components/Slides'
import { TemplatePreview } from '../../bundles/pages/TemplatePreview';
import { useState } from 'react';
import { ValueCardSettings } from '../autopilot/ValueCardSettings';
import { ActionCardSettings } from '../autopilot/ActionCardSettings';

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

const SecondSlide = ({ selected, states, icons, actions, setCard }) => {
  const emptyCard = { key: "key", type: selected, width: 2, height: 6, name: selected, icon: iconTable[selected] }

  return <YStack>
      {selected == "value" ?
        <ValueCardSettings states={states} icons={icons} card={emptyCard} onEdit={(data) => {
          setCard(data)
        }}/> :
        <ActionCardSettings states={states} icons={icons} card={emptyCard} actions={actions} onEdit={(data) => {
          setCard(data)
        }}/>}
    <Spacer marginBottom="$8" />
  </YStack>
}

export const CardSelector = ({ cards, addOpened, setAddOpened, onFinish, states, icons, actions }) => {
  const [selectedCard, setSelectedCard] = useState('value')
  const [card, setCard] = useState({ key: "key", type:selectedCard, width: 2, height: 6, name: selectedCard, icon: iconTable[selectedCard] })

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
    <YStack f={1} jc="center" ai="center">
      <XStack mr="$5">
        <Slides
          styles={{ w: 1400, mah: 1200 }}
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
              component: <SecondSlide selected={selectedCard} states={states} icons={icons} actions={actions} card={card} setCard={setCard} />
            }
          ]
          }></Slides>
      </XStack>
      {/* </ScrollView> */}
    </YStack>
  </AlertDialog>
}