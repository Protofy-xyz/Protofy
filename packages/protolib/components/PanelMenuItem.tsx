import { XStack, Text, SizableText, StackProps } from 'tamagui'
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
      paddingHorizontal={"$4"}
      paddingVertical={"$3"}
      hoverStyle={{
        backgroundColor: "$backgroundHover"
      }}
      borderRadius={"$6"}
      width={230}
      onPress={onPress}
      cursor='pointer'
      {...(selected ? {
        backgroundColor: "$backgroundHover"
      } : {})}
      {...props}
    >
      {icon ? <Text marginTop={"$0"} marginRight={text?"$4":"$0"}>
        {icon}
      </Text> : null}
      {text ? <SizableText selectable={false} pointerEvents="none" color="$color12" size="$5">
        {text}
      </SizableText> : null}
      {children}
    </XStack>
  )
})