import React from "react"
import { Card, CardProps, YStack } from "tamagui"

const OverlayCard = React.forwardRef((props: CardProps, ref:any) => {  
    return (
      //@ts-ignore
      <Card ref={ref} bw={1} boc="$borderColor" br="$6" elevation="$6" shadowRadius={60}>
        <YStack
          jc="center"
          p="$6"
          space="$5"
          maw="calc(min(90vw, 400px))"
          //@ts-ignore
          $sm={{ p: '$5' }}
          {...props}
        >
          {props.children}
        </YStack>
      </Card>
    )
  })

export default OverlayCard