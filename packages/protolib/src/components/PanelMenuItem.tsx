import { XStack, Text, SizableText, StackProps, Paragraph, Stack } from '@my/ui'
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
      paddingHorizontal={"$4"}
      paddingVertical={7}
      hoverStyle={{
        backgroundColor: resolvedTheme == 'dark'? '$color1': "$color3"
      }}
      ai="center"
      br="$4"
      h={40}
      f={1}
      onPress={onPress}
      cursor='pointer'
      {...(selected ? {
        backgroundColor: resolvedTheme == 'dark'? '$color2': "$color4"
      } : {})}
      {...props}
    >
      {icon ? <Stack marginRight={text?"$3":"$0"}>
        {React.cloneElement(icon, { ...icon.props, color: selected ? '$color8' : icon.props?.color })}
      </Stack> : null}
      {text ? <SizableText numberOfLines={1} ellipsizeMode="tail" selectable={false}  pointerEvents="none" color="$color" o={1} size="$4" fontWeight={selected?"400":"400"}>
        {text}
      </SizableText> : null}
      {children}
    </XStack>
  )
})