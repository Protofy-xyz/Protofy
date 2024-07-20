import React from "react"
import { Card, CardProps, YStack } from "tamagui"

const OverlayCard = React.forwardRef((props: CardProps, ref:any) => {  
    return (
      //@ts-ignore
      <Card ref={ref} borderWidth={1} borderColor="$borderColor" borderRadius="$6" elevation="$6" shadowRadius={60}>
        <YStack
         justifyContent="center"
          padding="$6"
          space="$5"
          maxWidth="calc(min(90vw, 400px))"
          //@ts-ignore
          $sm={{ padding: '$5' }}
          {...props}
        >
          {props.children}
        </YStack>
      </Card>
    )
  })

export default OverlayCard