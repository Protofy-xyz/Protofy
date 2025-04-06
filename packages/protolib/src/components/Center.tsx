import { StackProps, YStack } from "@my/ui"
import React from 'react'

export const Center = React.forwardRef(({children, ...props}: StackProps, ref:any) => (
    <YStack flex={1} alignItems="center" justifyContent="center" ref={ref} {...props}>
        {children}
    </YStack>
))
export default Center