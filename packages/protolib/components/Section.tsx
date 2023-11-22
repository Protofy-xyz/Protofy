import { TintSection } from "./TintSection"
import { useTint } from "protolib"
import React from "react"
import { StackProps, YStack } from "tamagui"
import { Theme } from "tamagui"
import {Tinted} from './Tinted'

const Section = React.forwardRef((props: StackProps, ref: any) => (
    <YStack ref={ref} flex={1} {...props}>
        <Tinted>{props.children}</Tinted>
    </YStack>
))

export default Section