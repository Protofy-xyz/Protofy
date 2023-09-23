import { TintSection } from "./TintSection"
import { useTint } from "@tamagui/logo"
import React from "react"
import { StackProps, YStack } from "tamagui"
import { Theme } from "tamagui"

function TintTheme({ children }) {
    const { tint, name } = useTint()
    console.log('tint: ', tint)
    // const element = useAlwaysConcurrent()

    return (
        <Theme name={tint as any}>
            {children}
        </Theme>
    )
}

type SectionProps = {
    children?: any,
    sectionProps?: any,
    containerProps?: StackProps
}

const Section = React.forwardRef(({ containerProps = {}, children, sectionProps = { index: 0 } }: SectionProps, ref: any) => (
    <YStack ref={ref} flex={1}>
        <TintTheme>{children}</TintTheme>
    </YStack>

))

export default Section