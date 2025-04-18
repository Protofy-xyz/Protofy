import { ThemeTintAlt } from '../lib/Tints'
import Link from 'next/link'
import {
  Button,
  Text,
  XStack,
  StackProps
} from '@my/ui'
import React from 'react'

type AnounceBubbleProps = {
  href: string,
  children?: any,
  color?: number
}


export default React.forwardRef(({ href, children, color = 2, ...props}: AnounceBubbleProps & StackProps, ref: any) => (
  //@ts-ignore
  <XStack als="center" ref={ref} {...props}>
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