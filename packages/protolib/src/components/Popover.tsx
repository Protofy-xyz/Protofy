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
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ x: 0, y: -10, opacity: 0 }}
        exitStyle={{ x: 0, y: -10, opacity: 0 }}
        x={0}
        y={0}
        opacity={1}
        backgroundColor={color}
        //@ts-ignore
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        animateOnly={['transform', 'opacity']}
        padding={0}
        maxHeight="80vh"
        elevate
        zIndex={100000000}

      >
        <TamaguiPopover.Arrow borderWidth={1} borderColor="$borderColor" backgroundColor={color}/>

        <TamaguiPopover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {children}
        </TamaguiPopover.ScrollView>
      </TamaguiPopover.Content>
    </TamaguiPopover>
  )
})