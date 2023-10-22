import React, { memo, useEffect, useState } from 'react'
import { Circle, XStack, XStackProps, Text, Paragraph } from 'tamagui'

import { useTint } from 'protolib'

export const Logo = React.forwardRef(
  ({
    text='',
    downscale = 1,
    animated,
    ...props
  }: XStackProps & { text: string; downscale?: number; animated?: boolean }, ref:any) => {
    const Tint = useTint()
    const { tintIndex: index, tint } = Tint
    const tints = Tint.tints.map((t) => `var(--${t}9)`)
    const [hovered, setHovered] = useState(false)
    const [mounted, setMounted] = useState<'start' | 'animate' | 'done'>('start')

    useEffect(() => {
      const idle = window.requestIdleCallback || setTimeout
      idle(() => {
        setTimeout(() => {
          setMounted('animate')
        }, 50)

        setTimeout(() => {
          setMounted('done')
        }, 1500)
      })
    }, [])

    const getColor = (i: number) => {
      const isActive = mounted !== 'start' && i === index
      if (mounted !== 'done' || hovered) {
        return isActive ? 'var(--color)' : tints[index]
      }
      if (hovered && isActive) {
        return 'var(--color)'
      }
      return tints[i]
    }

    const x = Math.round(
      index * 15 + (18 / 2) * (index / tints.length) + 3 + (index === 6 ? -3 : 0)
    )

    return (
      <XStack
      ref={ref}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        paddingVertical="$2"
        marginVertical="$-2"
        position="relative"
        {...props}
      >
        {animated && (
          <Circle
            animation="quick"
            position="absolute"
            top={0}
            left={0}
            // enterStyle={{
            //   y: -30
            // }}
            y={mounted === 'start' ? -30 : -3}
            // the last i is less wide
            x={x}
            size={4}
            backgroundColor="$color9"
          />
        )}
        <Paragraph fontWeight={"bold"} fontFamily="$silkscreen" fontSize="$8">
          {text.split('').map((c, i) => <Text key={i} onMouseEnter={() => Tint.setTintIndex(i % 7)} color={getColor(i % 7)}>{c}</Text>)}
        </Paragraph>
      </XStack>
    )
  }
)