import React from "react"
import { StackProps, YStack} from "tamagui"

const VCenterStack = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    <YStack ref={ref} alignItems="center" justifyContent="center" {...props}>
        {props.children}
    </YStack>
))

export default VCenterStack