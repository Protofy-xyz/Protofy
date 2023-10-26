import { isWeb } from '@tamagui/core'
import { XStack } from '@tamagui/stacks'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Center from './Center'
import { Spinner, Stack } from 'tamagui'
import { useContainerPosition, useMasonry, usePositioner, useResizeObserver } from 'masonic'
import { useTimeout, useWindowSize } from 'usehooks-ts'
import { Masonry } from 'masonic'
// const Masonry = dynamic(() => import('masonic').then(mod => mod.Masonry), {
//   ssr: false,
//   loading: () => <Center><Spinner /></Center>, 
// });

export type GridProps = {
  children?: any
  itemMinWidth?: number
  gap?: any
  columns?: number
  data?:any
  card?: any,
  spacing?:number,
  masonry?:boolean,
  containerRef?: any,
  rightGap?: number
}

const defaultSize = {width: 0, height: 0}
export const useSize = <T extends HTMLElement = HTMLElement>(
  ref: React.MutableRefObject<T | null>,
  deps: any[] = []
): {width: number; height: number} => {
  const [size, setSize] = useState<{width: number; height: number}>(defaultSize)

  useLayoutEffect(() => {
    const {current} = ref

    if (current) {
      const handleResize = () => {
        const computedStyle = getComputedStyle(current)
        const float = parseFloat
        const width =
          current.clientWidth -
          float(computedStyle.paddingTop) -
          float(computedStyle.paddingBottom)
        const height =
          current.clientHeight -
          float(computedStyle.paddingLeft) -
          float(computedStyle.paddingRight)
        setSize({height, width})
      }

      handleResize()
      window.addEventListener('resize', handleResize)
      window.addEventListener('orientationchange', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('orientationchange', handleResize)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.concat(ref.current))

  return size
}

export const useScroller = <T extends HTMLElement = HTMLElement>(
  ref: React.MutableRefObject<T | null>
): {scrollTop: number; isScrolling: boolean} => {
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  useLayoutEffect(() => {
    const {current} = ref
    let tick: number | undefined

    if (current) {
      const scrollAbleNode = current
      const handleScroll = () => {
        if (tick) return
        tick = window.requestAnimationFrame(() => {
          setScrollTop(scrollAbleNode.scrollTop)
          tick = void 0
        })
      }
      console.log('scrollAbleNode: ', scrollAbleNode)
      scrollAbleNode.addEventListener('scroll', handleScroll)
      return () => {
        scrollAbleNode.removeEventListener('scroll', handleScroll)
        if (tick) window.cancelAnimationFrame(tick)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  useLayoutEffect(() => {
    setIsScrolling(true)
    const to = window.setTimeout(() => {
      // This is here to prevent premature bail outs while maintaining high resolution
      // unsets. Without it there will always bee a lot of unnecessary DOM writes to style.
      setIsScrolling(false)
    }, 1000 / 6)
    return () => window.clearTimeout(to)
  }, [scrollTop])

  return {scrollTop, isScrolling}
}


export const Grid = React.forwardRef(({masonry=true, containerRef, rightGap=0, spacing, children, data, card, columns, itemMinWidth = 200, gap }: GridProps, ref:any)  => {  
  if (isWeb && data && card) {
    if(masonry && containerRef) {
      const container = {current: containerRef.current?.container? containerRef?.current?.container.firstChild: containerRef.current}
      const { width, height } = useSize(container);
      const { scrollTop, isScrolling } = useScroller(container);
      const positioner = usePositioner(
        { width:Math.max(0,width-rightGap), columnGutter: spacing, columnWidth: itemMinWidth }
      );
      const resizeObserver = useResizeObserver(positioner);
      return (
        useMasonry(
          {
            positioner,
            scrollTop,
            isScrolling,
            height:height,
            items: data,
            overscanBy: 5,
            resizeObserver,
            render: card
          }
        )
      )
    } 

    return <XStack flexWrap='wrap'>
      {
        data.map(ele => {
          return <Stack m={spacing/2}> { React.createElement(card, {index: ele.index, data: {...ele}, width: itemMinWidth}) } </Stack>
        })
      }
    </XStack>

  } else if (isWeb) {
    return (
      <div
        ref={ref}
        style={{
          gap,
          display: 'grid',
        //   justifyContent: 'stretch',
          // gridTemplateRows: 'repeat(4, 1fr)',
          gridTemplateColumns: `repeat( auto-fill, minmax(${itemMinWidth}px, 1fr) )`,
          // gridTemplateColumns: '1fr 1fr',
        }}
      >
        {children}
      </div>
    )
  }

  const childrenList = React.Children.toArray(children)

  return (
    <XStack alignItems="center" justifyContent="center" flexWrap="wrap">
      {childrenList.map((child, i) => {
        if (!child) {
          return null
        }

        // index key bad
        return (
          <XStack
            key={i}
            flex={1}
            minWidth={itemMinWidth}
            marginRight={gap}
            marginBottom={gap}
          >
            {child}
          </XStack>
        )
      })}
    </XStack>
  )
})
