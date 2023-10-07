import { StackProps, YStack } from "tamagui"
import React from 'react'

const Center = React.forwardRef(({children, ...props}: StackProps, ref:any) => (
    <YStack flex={1} alignItems="center" justifyContent="center" space="$4" ref={ref} {...props}>
        {children}
    </YStack>
))
export default Center