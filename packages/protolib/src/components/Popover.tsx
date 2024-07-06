import { Menu } from '@tamagui/lucide-icons'
import * as React from 'react'
import { Adapt, Button, Popover as TamaguiPopover } from 'tamagui'

export const Popover = React.memo(function Popover({ children, menuPlacement = "bottom", trigger = <Menu /> , isOpen, onOpenChange, color = '$color1' }: any) {
  
  return (
    <TamaguiPopover
      keepChildrenMounted
      open={isOpen}
      onOpenChange={onOpenChange}
      size="$5"
      stayInFrame={{ padding: 20 }}
      placement={menuPlacement}
      
    >
      <TamaguiPopover.Trigger asChild >
       {trigger}
      </TamaguiPopover.Trigger>
      {/*@ts-ignore*/}
      <Adapt platform="touch" when="sm">
        <TamaguiPopover.Sheet
          zIndex={100000000}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}

        >
          <TamaguiPopover.Sheet.Frame >
            <TamaguiPopover.Sheet.ScrollView>
              <Adapt.Contents />
            </TamaguiPopover.Sheet.ScrollView>
          </TamaguiPopover.Sheet.Frame>
          <TamaguiPopover.Sheet.Overlay zIndex={100}  />
        </TamaguiPopover.Sheet>
      </Adapt>

      <TamaguiPopover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        x={0}
        y={0}
        o={1}
        bc={color}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        animateOnly={['transform', 'opacity']}
        p={0}
        maxHeight="80vh"
        elevate
        zIndex={100000000}

      >
        <TamaguiPopover.Arrow borderWidth={1} boc="$borderColor" bc={color}/>

        <TamaguiPopover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {children}
        </TamaguiPopover.ScrollView>
      </TamaguiPopover.Content>
    </TamaguiPopover>
  )
})