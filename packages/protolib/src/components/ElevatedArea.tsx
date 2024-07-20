import { StackProps, YStack } from "tamagui";
import React from "react"

export const ElevatedArea = React.forwardRef((props:StackProps, ref:any) => (
    <YStack
        ref={ref}
        //@ts-ignore
        position="relative"
        elevation="$4"
        paddingVertical="$4"
        paddingTop="$6"
        paddingBottom="$10"
        zIndex={1}
        {...props}
    >
        {/*@ts-ignore*/}
        <YStack fullscreen backgroundColor="$color3" zi={-1} opacity={0.25} borderTopWidth={1} btc="$borderColor" />
        {props.children}
    </YStack>
))

export default ElevatedArea