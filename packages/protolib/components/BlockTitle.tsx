import { StackProps, YStack } from "tamagui"
import { Head2 } from "./Head2"
import { Head3 } from "./Head3"
import React from 'react'

type BlockTitleProps = {
    title: any,
    subtitle?: any
}

const BlockTitle = React.forwardRef(({title='', subtitle='', ...props}: BlockTitleProps & StackProps, ref: any) => (
    //@ts-ignore
    <YStack ai="center" space="$3" {...props} ref={ref}>
        <Head2>{title}</Head2>
        {/* @ts-ignore */}
        {subtitle?<Head3 ai="center" jc="center">{subtitle}</Head3>:null}
    </YStack>
))

export default BlockTitle