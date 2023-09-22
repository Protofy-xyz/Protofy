import React from 'react'
import {
    Stack,
  Text,
  TooltipSimple,
  VisuallyHidden,
  YStack,
} from 'tamagui'

type TooltipContainerProps = {
    children?:any,
    tooltipText?:string
}

const TooltipContainer = React.forwardRef(({children, tooltipText=''}: TooltipContainerProps, ref:any) => (
    <Stack ref={ref}>
        <TooltipSimple placement="top" delay={0} restMs={25} label={tooltipText}>
        {/* @ts-ignore */}
        <YStack p="$5" $sm={{ p: '$3' }} opacity={0.65} hoverStyle={{ opacity: 1 }}>
            <VisuallyHidden>
            <Text>{tooltipText}</Text>
            </VisuallyHidden>
            {children}
        </YStack>
        </TooltipSimple>
    </Stack>
))

export default TooltipContainer