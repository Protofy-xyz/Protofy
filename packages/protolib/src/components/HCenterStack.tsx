import React from "react"
import { StackProps, XStack } from "tamagui"

export const HCenterStack = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    <XStack ref={ref} alignItems="center" justifyContent="center" {...props}>
        {props.children}
    </XStack>
))

export default HCenterStack