import React from "react"
import { YStack } from "@my/ui"

export const SpotLight = React.forwardRef((props: any, ref: any) => (
    <YStack
        ref={ref}
        o={0.75}
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