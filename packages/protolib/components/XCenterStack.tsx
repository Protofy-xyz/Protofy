import React from "react"
import { StackProps, XStack } from "tamagui"

const XCenterStack = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    <XStack ref={ref} ai="center" jc="center" $xxs={{ ai: 'center', fw: 'wrap' }} {...props}>
        {props.children}
    </XStack>
))

export default XCenterStack