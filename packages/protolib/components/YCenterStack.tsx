import React from "react"
import { StackProps, YStack} from "tamagui"

const YCenterStack = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    <YStack ref={ref} ai="center" jc="center" {...props}>
        {props.children}
    </YStack>
))

export default YCenterStack