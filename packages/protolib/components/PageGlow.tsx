import { useTint } from '@tamagui/logo'
import { memo, useMemo, useState } from 'react'
import { ThemeName, YStack, isClient, useDebounce, Stack } from 'tamagui'

import { useTintSectionIndex } from './TintSection'
import React from 'react'

export const PageGlow = memo(React.forwardRef((props:any, ref: any) => {
  const { tints, tint, name, tintIndex } = useTint()
  const isHeroBelowColor = tint === 'blue' || tint === 'green' || tint === 'purple'
  const [index, setIndex] = useState(0)
  const isAtTop = index <= 1
  const isOnHeroBelow = isAtTop && isHeroBelowColor
  const [scrollTop, setScrollTopRaw] = useState(0)
  const setScrollTop = useDebounce(setScrollTopRaw, 200)
  const xs = 400
  const scale = isOnHeroBelow ? 0.5 : 1

  if (isClient) {
    useTintSectionIndex((index) => {
      setIndex(index)
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + 100)
    })
  }

  const glows = useMemo(() => {
    return (
      <Stack>
        {tints.map((cur, i) => {
          const isDouble = name === 'xmas' || name === 'easter'
          const active = isDouble ? i == 0 || i == 1 : cur === tint
          const isOpposite = isDouble && cur === 'green' && tint !== cur
          return (
            <YStack
              key={`${cur}${i}`}
              overflow="hidden"
              //@ts-ignore
              h="100vh"
              w={1000}
              theme={cur as ThemeName}
              o={active ? 0.3 : 0}
              fullscreen
              left={`calc(50vw - 500px)`}
              x={isOnHeroBelow ? 0 : isDouble ? (isOpposite ? -500 : 500) : 0}
              scale={scale}
              className="hero-blur"
            />
          )
        })}
      </Stack>
    )
  }, [scale, tint, tints])

  return (
    <YStack
      ref={ref}
      //@ts-ignore
      pos="absolute"
      t={0}
      l={0}
      contain="layout"
      pe="none"
      animation="quick"
      key={0}
      zi={-1}
      x={0}
      y={scrollTop}
      {...(isOnHeroBelow && {
        animation: 'quick',
        x: tintIndex === 2 ? -xs : tintIndex === 4 ? xs : 0,
        y: 300,
      })}
    // display={isResizing ? 'none' : 'flex'}
    >
      {glows}
    </YStack>
  )
}))
