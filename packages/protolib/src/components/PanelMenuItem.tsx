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

export const PanelMenuItem = ({onPress, children, selected, icon, text}:PanelMenuItemProps) => {
  return (
      <XStack
        marginLeft={"$6"}
        paddingLeft={"$6"}
        paddingVertical={"$3"}
        hoverStyle={{
          backgroundColor: "var(--color2)"
        }}
        borderRadius={"$6"}
        width={250}
        alignItems={"center"}
        onPress={onPress}
        cursor='pointer'
        {...(selected ? {
          backgroundColor: "var(--color2)"
        } : {})}
      >
        {icon?<Text marginTop={"$1"} marginRight={"$4"}>
          {icon}
        </Text>:null}
        {text?<SizableText selectable={false} pointerEvents="none" color="var(--color12)" size="$5" fontWeight="800">
          {text}
        </SizableText>:null}
        {children}
      </XStack>
  )
}