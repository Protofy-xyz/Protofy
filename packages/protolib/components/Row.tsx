import React from "react"
import { StackProps, YStack } from "tamagui"

const Row = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    <YStack ref={ref} {...props}>
        {props.children}
    </YStack>
))

export default Row