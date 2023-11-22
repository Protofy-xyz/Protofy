import React from "react"
import { YStack } from "tamagui"

const SpotLight = React.forwardRef((props: any, ref: any) => (
    <YStack
        ref={ref}
        o={0.75}
        zi={-1}
        pos="absolute"
        t={0}
        l={0}
        r={0}
        h={2000}
        className="hero-blur"
        {...props}
    />
))

export default SpotLight