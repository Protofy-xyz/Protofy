import { ThemeTintAlt } from '../lib/Tints'
import Link from 'next/link'
import {
  Button,
  Text,
  XStack,
  StackProps
} from 'tamagui'
import React from 'react'

type AnounceBubbleProps = {
  href: string,
  children?: any,
  color?: number
}


export default React.forwardRef(({ href, children, color = 2, ...props}: AnounceBubbleProps & StackProps, ref: any) => (
  //@ts-ignore
  <XStack alignSelf="center" ref={ref} {...props}>
    <Link prefetch={false} href={href}>
      <ThemeTintAlt>
        <Button
          //@ts-ignore
          borderWidth={color}
          borderColor="$color5"
          size="$3"
          borderRadius="$10"
          elevation="$1"
          fontFamily="$silkscreen"
        >
          {children}
        </Button>
      </ThemeTintAlt>
    </Link>
  </XStack>
))