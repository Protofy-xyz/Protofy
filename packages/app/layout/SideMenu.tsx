import { NextLink, Logo, ContainerLarge, ExternalIcon, ParagraphLink } from 'protolib'
import React from 'react'
import { H4, Paragraph, Text, XStack, YStack } from 'tamagui'
import { Scrollbars } from 'react-custom-scrollbars-2';

export const SideMenu = ({sideBarColor='$background', children, ...props}:any) => {
    return <YStack bc={sideBarColor} {...props}>
            <YStack $sm={{display:'none'}} width={300} height="100%">
                <Scrollbars universal height="100%">
                    {children}
                </Scrollbars>
            </YStack>
    </YStack>
}
