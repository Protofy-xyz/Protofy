import React from 'react'
import { StackProps, YStack } from 'tamagui'


export const LogoIcon = React.forwardRef(({ children, ...props }: StackProps, ref:any) => {
  return (
    <YStack
    ref={ref}
      tag="span"
      className="unselectable"
      alignSelf="center"
      marginVertical={-10}
      pressStyle={{
        opacity: 1,
        scaleY: -1,
      }}

      hoverStyle={{
        opacity: 0.8
      }}

      {...props}
    >
        {children}
    </YStack>
  )
})