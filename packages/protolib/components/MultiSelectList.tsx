import { YStack, SelectProps, Select, Adapt, Sheet, getFontSize, XStack, Paragraph } from "tamagui";
import { ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons';
import { useEffect, useMemo, useRef, useState } from "react";
import { Tinted } from "./Tinted";

export function MultiSelectList({ choices, setChoices, onSetSelections, maxHeight = "150px" }: any & { maxHeight: String }) {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false);
  const [selections, setSelections] = useState([]);

  const updateSelections = (e, cName) => {
    const target = choices[choices.indexOf(cName)]
    if (selections.includes(target)) {
      setSelections(prev => prev.filter(slc => slc !== target))
    } else {
      setSelections(prev => prev.concat(target))
    }
  }

  return (
    <Tinted>
      <XStack
        ref={rootRef}
        backgroundColor="$backgroundTransparent"
        width="100%"
        height="fit-content"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="10px"
        paddingVertical="7px"
        borderRadius={6}
        outlineColor="$gray6"
        outlineWidth={1}
        outlineStyle='solid'
        borderColor='$gray6'
        cursor="pointer"
        onPress={() => setOpen(prev => !prev)}
      >
        <XStack
          flexWrap="wrap"
          height="fit-content"
          overflow="hidden"
          flex={1}
          gap="$1.5"
        >
          {
            selections.length > 0
              ? selections.map((selection, i) =>
                <Paragraph
                  paddingHorizontal="7px"
                  paddingVertical="4px"
                  backgroundColor="$color7"
                  borderRadius={4}
                  color="white"
                  onPress={(e) => updateSelections(e, selection)}
                >{selection}</Paragraph>
              )
              : <Paragraph
                paddingHorizontal="7px"
                paddingVertical="4px"
                borderRadius={4}
                color="$gray8"
              >Select</Paragraph>
          }
        </XStack>
        <ChevronDown />
        {
          open
            ? <YStack
              zIndex={999}
              position="absolute"
              top={"130%"}
              left={"0%"}
              width="100%"
              backgroundColor={"$gray1"}
              paddingHorizontal="7px"
              paddingVertical="7px"
              borderRadius={4}
              outlineColor="$gray6"
              outlineWidth={1}
              outlineStyle='solid'
              borderColor='$borderColor'
              maxHeight={maxHeight}
              gap="$1.5"
              overflow="scroll"
            >
              {
                choices.map((choice, i) => {
                  return selections.includes(choice)
                    ? <Paragraph
                      paddingHorizontal="10px"
                      paddingVertical="7px"
                      borderRadius={4}
                      fontSize={"$5"}
                      fontFamily={"$body"}
                      backgroundColor="$color7"
                      hoverStyle={{
                        cursor: 'pointer'
                      }}
                      onPress={(e) => updateSelections(e, choice)}
                    >{choice}</Paragraph>
                    : <Paragraph
                      paddingHorizontal="10px"
                      paddingVertical="7px"
                      borderRadius={4}
                      fontSize={"$5"}
                      fontFamily={"$body"}
                      color="$color"
                      hoverStyle={{
                        backgroundColor: '$backgroundPress',
                        cursor: 'pointer'
                      }}
                      onPress={(e) => updateSelections(e, choice)}
                    >{choice}</Paragraph>
                })
              }
            </YStack>
            : null
        }
      </XStack>
    </Tinted>
  )
}