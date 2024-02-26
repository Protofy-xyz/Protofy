import React from "react"
import { StackProps, YStack } from "tamagui"

const Spacer = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    <YStack ref={ref} width="100%" flexBasis="100px" alignSelf="center" {...props}></YStack>
))

export default Spacer