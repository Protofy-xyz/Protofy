import { YStack, SelectProps, Select, Adapt, Sheet, getFontSize, SelectTriggerProps } from "tamagui";
import { ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons';
import { useEffect, useMemo, useState } from "react";

export function SelectList({ title, value, elements, setValue, triggerProps, valueProps, rawDisplay, ...props }: SelectProps & { valueProps?:any,triggerProps?: SelectTriggerProps, rawDisplay?:boolean, title: any, elements: any[], value: any, setValue: any }) {

  let displaySelected = elements.find((element) => element.value && element.value === value)
  if(displaySelected) {
    displaySelected = displaySelected.caption
  } else {
    displaySelected = value
  }
  
  return (
    <Select
      id="select"
      defaultValue={value}
      onValueChange={setValue}
      disablePreventBodyScroll
      {...props}
    >
      <YStack id={"eo-select-list-" + title} />
      <Select.Trigger flex={1} iconAfter={ChevronDown} {...triggerProps}>
        {!rawDisplay && <Select.Value {...valueProps} placeholder="choose an option">{displaySelected}</Select.Value>}
        {rawDisplay && displaySelected}
      </Select.Trigger>
      
      {/* @ts-ignore */}
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
            //@ts-ignore
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
          // enterStyle={{ opacity: 0, y: -10 }}
          // exitStyle={{ opacity: 0, y: 10 }}
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
                      // debug="verbose"
                      index={i}
                      key={item.value ?? item}
                      value={item.value ?? item}
                      style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}
                    >
                      <YStack id={"eo-select-list-"+title+"-item-" + i}></YStack>
                      <Select.ItemText>{item.caption ?? item}</Select.ItemText>
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