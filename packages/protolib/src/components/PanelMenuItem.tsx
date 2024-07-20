import { XStack, SizableText, StackProps, Stack } from '@my/ui'
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
      alignItems="center"
      borderTopRightRadius={"$10"}
      borderBottomRightRadius={"$10"}
      flex={1}
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
      {text ? <SizableText selectable={false}  pointerEvents="none" color="$color" opacity={1} size="$4" fontWeight={selected?"600":"500"}>
        {text}
      </SizableText> : null}
      {children}
    </XStack>
  )
})