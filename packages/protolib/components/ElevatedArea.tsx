import { StackProps, YStack } from "tamagui";
import React from "react"

const ElevatedArea = React.forwardRef((props:StackProps, ref:any) => (
    <YStack
        ref={ref}
        //@ts-ignore
        pos="relative"
        zi={1000}
        elevation="$4"
        py="$4"
        pt="$6"
        pb="$10"
        {...props}
    >
        {/*@ts-ignore*/}
        <YStack fullscreen bc="$color3" zi={-1} o={0.25} btw={1} btc="$borderColor" />
        {props.children}
    </YStack>
))

export default ElevatedArea