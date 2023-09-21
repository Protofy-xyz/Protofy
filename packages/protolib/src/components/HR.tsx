import React from 'react'
import { EnsureFlexed, StackProps, YStack } from 'tamagui'

export const HR = React.forwardRef(({lineColor="$borderColor", lineHeight=1, ...props}: StackProps & {lineHeight?: any, lineColor?: any}, ref:any) => (
  //@ts-ignore
  <YStack my="$10" mx="auto" maxWidth="50%" ref={ref} {...props}>
    <EnsureFlexed />
    <YStack borderBottomColor={lineColor} borderBottomWidth={lineHeight} flex={1} />
  </YStack>
))
