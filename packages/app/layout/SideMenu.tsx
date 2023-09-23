import { NextLink, Logo, ContainerLarge, ExternalIcon, ParagraphLink } from 'protolib'
import React from 'react'
import { H4, Paragraph, Text, XStack, YStack } from 'tamagui'

export const SideMenu = ({sideBarColor='$background', children, ...props}:any) => {
    return <YStack bc={sideBarColor} {...props}>
        <YStack $sm={{display:'none'}} width={300}>
            {children}
        </YStack>
    </YStack>
}