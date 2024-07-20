import { Check } from '@tamagui/lucide-icons'
import React from 'react'
import { YStack } from 'tamagui'

export const CheckCircle = React.forwardRef((props:any, ref:any) => (
  //@ts-ignore
  <YStack marginTop={2} backgroundColor="$backgroundHover" width={25} height={25} alignItems="center" justifyContent="center" borderRadius={100} marginRight="$2.5" ref={ref}>
    <Check size={12} color="var(--colorHover)" />
  </YStack>
))
