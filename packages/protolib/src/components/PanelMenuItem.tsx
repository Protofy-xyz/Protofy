import { XStack, Text, SizableText, StackProps, Paragraph, Stack } from 'tamagui'
import React from 'react'
import { useThemeSetting } from '@tamagui/next-theme'

export type PanelMenuItemProps = {
  icon?: React.ReactNode,
  text?: React.ReactNode,
  children?: React.ReactNode,
  onPress?: any,
  selected?: boolean
}

export const PanelMenuItem = React.forwardRef(({ onPress, children, selected, icon, text, ...props } : PanelMenuItemProps & StackProps, ref: any) => {
  const {resolvedTheme} = useThemeSetting()
  return (
    <XStack
      ref={ref}
      paddingHorizontal={"$8"}
      paddingVertical={7}
      hoverStyle={{
        backgroundColor: "$gray3"
      }}
      ai="center"
      btrr={"$10"}
      bbrr={"$10"}
      f={1}
      onPress={onPress}
      cursor='pointer'
      {...(selected ? {
        backgroundColor: resolvedTheme == 'dark'? '$color2': "$color4"
      } : {})}
      {...props}
    >
      {icon ? <Stack marginRight={text?"$4":"$0"}>
        {icon}
      </Stack> : null}
      {text ? <SizableText selectable={false}  pointerEvents="none" color="$color" o={1} size="$4" fontWeight={selected?"600":"500"}>
        {text}
      </SizableText> : null}
      {children}
    </XStack>
  )
})