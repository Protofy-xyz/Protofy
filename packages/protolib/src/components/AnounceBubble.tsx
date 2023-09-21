import { ThemeTintAlt } from '@tamagui/logo'
import Link from 'next/link'
import {
  Button,
  Text,
  XStack,
} from 'tamagui'
import React from 'react'

type AnounceBubbleProps = {
  href: string,
  children?: any,
  color?: number
}


export default React.forwardRef(({ href, children, color = 2 }: AnounceBubbleProps, ref: any) => (
  //@ts-ignore
  <XStack als="center" y={-70} ref={ref}>
    <Link prefetch={false} href={href}>
      <ThemeTintAlt>
        <Button
          //@ts-ignore
          bw={color}
          boc="$color5"
          size="$3"
          br="$10"
          elevation="$1"
          fontFamily="$silkscreen"
        >
          {children}
        </Button>
      </ThemeTintAlt>
    </Link>
  </XStack>
))