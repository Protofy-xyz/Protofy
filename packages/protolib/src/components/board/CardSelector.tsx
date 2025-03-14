import { YStack, XStack, Spacer, ScrollView, useThemeName } from '@my/ui'
import { AlertDialog } from '../../components/AlertDialog';
import { Slides } from '../../components/Slides'
import { TemplatePreview } from '../../bundles/pages/TemplatePreview';
import { useState } from 'react';

const SelectGrid = ({ children }) => {
    return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
        {children}
    </XStack>
  }

const FirstSlide = ({ selected, setSelected, options }) => {
    console.log("options",options)
    const themeName = useThemeName();
    return <YStack>
        <ScrollView mah={"500px"}>
            <SelectGrid>
                {options.map((option) => (
                    <TemplatePreview
                        from="boards"
                        theme={themeName}
                        template={option}
                        isSelected={selected === option.name}
                        onPress={() => setSelected(option.name)}
                    />
                ))}
            </SelectGrid>
        </ScrollView>
        <Spacer marginBottom="$8" />
    </YStack>
  }

export const CardSelector = ({ cards, addOpened, setAddOpened, onFinish }) => {
    const [selectedCard, setSelectedCard] = useState('value')
    return       <AlertDialog
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
          lastButtonCaption="Create"
          onFinish={async () => {
            await onFinish(selectedCard)
            setAddOpened(false)
          }}
          slides={[
            {
              name: "Create new widget",
              title: "Select the widget",
              component: <FirstSlide options={cards} selected={selectedCard} setSelected={setSelectedCard} />
            },
            // {
            //   name: "Configure your page",
            //   title: "Configure your page",
            //   component: <SecondSlide error={error} objects={objects} setError={setError} data={data} setData={setData} />
            // }
          ]
          }></Slides>
      </XStack>
      {/* </ScrollView> */}
    </YStack>
  </AlertDialog>
}