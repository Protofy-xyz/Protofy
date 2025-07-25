import { Button, ButtonProps, Circle, Stack, TooltipSimple } from '@my/ui'
import React from 'react'
import {useTint} from '../lib/Tints'

export const ColorToggleButton = React.forwardRef((props: ButtonProps, ref: any) => {
  const { tint, setNextTint } = useTint()
  return (
    <Stack ref={ref}>
      <TooltipSimple groupId="header-actions-color" label="Next theme">
        <Button size="$3" onPress={setNextTint} {...props} aria-label="Next theme">
          <Circle
            //@ts-ignore
            bw={1} boc="var(--color9)" m={2}
            size={13}
            backgroundColor={tint as any}
          />
        </Button>
      </TooltipSimple>
    </Stack>
  )
})
