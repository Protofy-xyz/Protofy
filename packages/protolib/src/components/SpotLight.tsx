import React from "react"
import { YStack } from "tamagui"

export const SpotLight = React.forwardRef((props: any, ref: any) => (
    <YStack
        ref={ref}
        opacity={0.75}
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={2000}
        className="hero-blur"
        {...props}
    />
))

export default SpotLight