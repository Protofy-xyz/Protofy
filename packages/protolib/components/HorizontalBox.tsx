import React from "react"
import { ContainerLarge } from "./Container"
import { StackProps, XStack, XStackProps } from "tamagui"

const HorizontalBox = React.forwardRef((props:StackProps, ref:any) => (
    <ContainerLarge ref={ref}>
        <XStack
        flex={1}
        overflow="hidden"
        maxWidth="100%"
        space="$8"
        flexWrap="nowrap"
        px="$2"
        mb={-8}

        $sm={{ flexDirection: 'column' }}
        $gtSm={{
            //@ts-ignore
            px: '$6',
        }}
        {...props}
        >
            {props.children}
        </XStack>
    </ContainerLarge>
))

export default HorizontalBox