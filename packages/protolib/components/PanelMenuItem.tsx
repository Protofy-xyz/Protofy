import { XStack, Text, SizableText, StackProps, Paragraph, Stack } from 'tamagui'
import React from 'react'

export type PanelMenuItemProps = {
  icon?: React.ReactNode,
  text?: React.ReactNode,
  children?: React.ReactNode,
  onPress?: any,
  selected?: boolean
}

export const PanelMenuItem = React.forwardRef(({ onPress, children, selected, icon, text, ...props } : PanelMenuItemProps & StackProps, ref: any) => {
  return (
    <XStack
      ref={ref}
      paddingHorizontal={"$8"}
      paddingVertical={8}
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
        backgroundColor: "$color4"
      } : {})}
      {...props}
    >
      {icon ? <Stack marginRight={text?"$4":"$0"}>
        {icon}
      </Stack> : null}
      {text ? <SizableText selectable={false} pointerEvents="none" color="$color12" o={1} size="$4" >
        {text}
      </SizableText> : null}
      {children}
    </XStack>
  )
})