import React from "react"
import { StackProps, YStack } from "tamagui"

const VStack = React.forwardRef((props: StackProps, ref: any) => (
  //@ts-ignore
  <YStack ref={ref} {...props}>
    {props.children}
  </YStack>
))

export default VStack