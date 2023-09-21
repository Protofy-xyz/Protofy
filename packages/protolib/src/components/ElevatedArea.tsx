import { YStack } from "tamagui";
import React from "react"

const ElevatedArea = React.forwardRef(({children}:any, ref:any) => (
    <YStack
        ref={ref}
        //@ts-ignore
        pos="relative"
        zi={1000}
        elevation="$4"
        py="$4"
        pt="$6"
        pb="$10"
    >
        {/*@ts-ignore*/}
        <YStack fullscreen bc="$color3" zi={-1} o={0.25} btw={1} btc="$borderColor" />
        {children}
    </YStack>
))

export default ElevatedArea