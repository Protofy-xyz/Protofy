import { YStack } from "tamagui"
import React from 'react'

const BackgroundGradient = React.forwardRef(({height=521, o=0.08, direction="up", ...props}:any, ref: any) => (
    <YStack
    ref={ref}
    className={"bg-grid mask-gradient-"+direction}
    fullscreen
    // @ts-ignore
    top="auto"
    height={height}
    left={-1000}
    right={-1000}
    flex={1}
    //@ts-ignore
    pe="none"
    o={o}
    {...props}
  />
))

export default BackgroundGradient