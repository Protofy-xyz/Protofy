import { YStack, XStack, Text, SizableText } from 'tamagui'
import { Database } from '@tamagui/lucide-icons'
import { useAtom } from 'jotai'
import React from 'react'

export type PanelMenuItemProps = {
  icon?: React.ReactNode,
  text?: React.ReactNode,
  children?: React.ReactNode,
  onPress?: any,
  selected?: boolean
}

export const PanelMenuItem = React.forwardRef(({ onPress, children, selected, icon, text }: PanelMenuItemProps, ref: any) => {
  return (
    <XStack
      ref={ref}
      paddingHorizontal={"$5"}
      paddingVertical={"$3"}
      paddingTop={"$4"}
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
    >
      {icon ? <Text marginTop={"$0"} marginRight={"$4"}>
        {icon}
      </Text> : null}
      {text ? <SizableText selectable={false} pointerEvents="none" color="var(--color12)" size="$5" fontWeight="800">
        {text}
      </SizableText> : null}
      {children}
    </XStack>
  )
})