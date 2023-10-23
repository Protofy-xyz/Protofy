import { useOnIntersecting } from '../lib/useOnIntersecting'
import { getTints,useTint} from '../lib/Tints'
import React from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { StackProps } from 'tamagui'
import { GetProps, XStack, YStack, styled } from 'tamagui'

type Props = SectionProps & { containerProps: StackProps, themed?: boolean; index: number }

// not use its fixed size
const numIntersectingAtSection: number[] = getTints().tints.map((_) => 0)

export const TintSection = React.forwardRef(({ containerProps, children, index, themed, zIndex, ...props }: Props, ref:any) => {
  const top = useRef<HTMLElement>(null)
  const bottom = useRef<HTMLElement>(null)
  const mid = useRef<HTMLElement>(null)
  const { tint, tints, setTintIndex } = useTint()

  useOnIntersecting(
    useMemo(() => [top, mid, bottom], []),
    (entries) => {
      const count = entries.reduce((a, b) => a + (b?.isIntersecting ? 1 : 0), 0)

      if (count < 2) {
        return
      }

      numIntersectingAtSection[index] = count

      let topIndex = -1
      let topStr = -1
      numIntersectingAtSection.forEach((str, index) => {
        if (str >= topStr) {
          topIndex = index
          topStr = str
        }
      })

      if (topIndex === index && topIndex !== current) {
        const tintIndex = topIndex <= 1 ? 3 : topIndex % tints.length
        setTintIndex(tintIndex)
        current = index
        listeners.forEach((cb) => cb(topIndex, count))
      }
    },
    {
      threshold: 0.1,
    }
  )

  return (
    //@ts-ignore
    <YStack {...containerProps} zIndex={zIndex} pos="relative" ref={ref}>
      {useMemo(() => {
        return (
          <>
            {/*@ts-ignore*/}
            <XStack ref={top} pos="absolute" t="10%" l={0} r={0} h={10} o={0} pe="none" />
            {/*@ts-ignore*/}
            <XStack ref={mid} pos="absolute" t="50%" l={0} r={0} h={10} o={0} pe="none" />
            <XStack
              ref={bottom}
              //@ts-ignore
              pos="absolute"
              b="10%"
              l={0}
              r={0}
              h={10}
              o={0}
              pe="none"
            />
          </>
        )
      }, [top, mid, bottom])}
      
      <HomeSection {...containerProps} theme={(themed ? tint : null) as any} {...props}>
        {useMemo(() => children, [children])}
      </HomeSection>
    </YStack>
  )
})

let current = 0
const listeners = new Set<Function>()

export const useTintSectionIndex = (cb: (index: number, str: number) => void) => {
  useEffect(() => {
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  }, [])
}

const StyledHomeSection = styled(YStack, {
  //@ts-ignore
  name: 'Section',
  //@ts-ignore
  pos: 'relative',
  py: '$14',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  } as const,
})

export const HomeSection = React.forwardRef((props: any, ref: any) => {
  return <StyledHomeSection ref={ref} {...props}>
    {props.children}
  </StyledHomeSection>;
})

type SectionProps = GetProps<typeof HomeSection>


