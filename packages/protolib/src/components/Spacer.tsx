import React from "react"
import { StackProps, YStack } from "@my/ui"
import { Spacer as TSpacer } from '@my/ui'

export const Spacer = React.forwardRef((props: StackProps, ref:any) => (
    //@ts-ignore
    // <YStack ref={ref} width="100%" flexBasis="100px" alignSelf="center" {...props}></YStack>
    <TSpacer ref={ref} pointerEvents="auto" width="100%" flexBasis="46px" alignSelf="center" {...props}/>
    ))

export default Spacer