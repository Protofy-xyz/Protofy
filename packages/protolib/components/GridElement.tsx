import { EnsureFlexed, H4, HeadingProps, Paragraph, StackProps, YStack } from "tamagui";
import React from "react"

const GridElement = React.forwardRef(({title, children, titleProps={}, ...props}: StackProps & {title: string, titleProps?: HeadingProps}, ref:any) => (
    //@ts-ignore
    <YStack space="$2" p="$4" ref={ref} {...props}>
        {/*@ts-ignore*/}
        <H4 ls={0} fontFamily="$silkscreen" ta="center" {...titleProps}>
            {title}
        </H4>
        <Paragraph theme="alt2">
            <EnsureFlexed />
            {children}
        </Paragraph>
    </YStack>
))

export default GridElement