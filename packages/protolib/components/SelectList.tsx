import { YStack, SelectProps, Select, Adapt, Sheet, getFontSize } from "tamagui";
import { ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons';
import { useMemo, useState } from "react";

export function SelectList({title, value, elements, setValue, ...props}: SelectProps & {title: any, elements: any[], value: any, setValue: any}) {
    return (
      <Select
        id="select"
        value={value}
        onValueChange={setValue}
        disablePreventBodyScroll
        {...props}
      >
        <Select.Trigger f={1} iconAfter={ChevronDown}>
          <Select.Value />
        </Select.Trigger>
  
        <Adapt when="sm" platform="touch">
          <Sheet
            native={!!props.native}
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: 'spring',
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
  
        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>

          </Select.ScrollUpButton>
  
          <Select.Viewport
            // to do animations:
            // animation="quick"
            // animateOnly={['transform', 'opacity']}
            // enterStyle={{ o: 0, y: -10 }}
            // exitStyle={{ o: 0, y: 10 }}
            minWidth={200}
          >
            <Select.Group>
              <Select.Label>{title}</Select.Label>
              {/* for longer lists memoizing these is useful */}
              {useMemo(
                () =>
                elements.map((item, i) => {
                    return (
                      <Select.Item
                        debug="verbose"
                        index={i}
                        key={item}
                        value={item}
                      >
                        <Select.ItemText>{item}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    )
                  }),
                [elements]
              )}
            </Select.Group>
            {/* Native gets an extra icon */}
            {props.native && (
              <YStack
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                width={'$4'}
                pointerEvents="none"
              >
                <ChevronDown size={getFontSize((props.size ?? '$true') as any)} />
              </YStack>
            )}
          </Select.Viewport>
  
          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>

          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    )
  }