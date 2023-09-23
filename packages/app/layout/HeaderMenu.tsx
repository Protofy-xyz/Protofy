import { Menu } from '@tamagui/lucide-icons'
import * as React from 'react'
import { Adapt, Button, Popover } from 'tamagui'

export const HeaderMenu = React.memo(function HeaderMenu({children, menuPlacement="bottom" }: any) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover
      keepChildrenMounted
      open={open}
      onOpenChange={setOpen}
      size="$5"
      stayInFrame={{ padding: 20 }}
      placement={menuPlacement}
    >
      <Popover.Trigger asChild>
        <Button
          size="$3"
          chromeless
          circular
          hoverStyle={{
            //@ts-ignore
            bc: 'transparent',
          }}
          noTextWrap
          onPress={() => setOpen(!open)}
          theme={open ? 'alt1' : undefined}
        >
          <Menu size={16} color="var(--color)" />
        </Button>
      </Popover.Trigger>
      {/*@ts-ignore*/}
      <Adapt platform="touch" when="sm">
        <Popover.Sheet
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
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView>
              <Adapt.Contents />
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay zIndex={100} />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
        x={0}
        y={0}
        o={1}
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
        <Popover.Arrow borderWidth={1} boc="$borderColor" />

        <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {children}
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  )
})