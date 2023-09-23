import React from "react"
import { ContainerLarge } from "./Container"
import { XStack, XStackProps } from "tamagui"

type HorizontalBoxProps = {
    children?: any,
    XStackProps?: XStackProps
}
const HorizontalBox = React.forwardRef(({children, XStackProps={}}:HorizontalBoxProps, ref:any) => (
    <ContainerLarge ref={ref}>
        <XStack
        flex={1}
        overflow="hidden"
        maxWidth="100%"
        space="$8"
        flexWrap="nowrap"
        px="$2"
        mb={-8}
        py="$4"
        $sm={{ flexDirection: 'column' }}
        $gtSm={{
            //@ts-ignore
            px: '$6',
        }}
        {...XStackProps}
        >
            {children}
        </XStack>
    </ContainerLarge>
))

export default HorizontalBox