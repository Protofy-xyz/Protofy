import React from "react"
import { ContainerLarge } from "./Container"
import { StackProps, XStack, XStackProps } from "tamagui"

export const HorizontalBox = React.forwardRef((props:StackProps, ref:any) => (
    <ContainerLarge ref={ref}>
        <XStack
        flex={1}
        overflow="hidden"
        maxWidth="100%"
        space="$8"
        flexWrap="nowrap"
        paddingHorizontal="$2"
        marginBottom={-8}

        $sm={{ flexDirection: 'column' }}
        $gtSm={{
            //@ts-ignore
            paddingHorizontal: '$6',
        }}
        {...props}
        >
            {props.children}
        </XStack>
    </ContainerLarge>
))

export default HorizontalBox