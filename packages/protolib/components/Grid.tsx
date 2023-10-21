import { isWeb } from '@tamagui/core'
import { XStack } from '@tamagui/stacks'
import React from 'react'
import dynamic from 'next/dynamic'
import Center from './Center'
import { Spinner } from 'tamagui'
import { useContainerPosition, useMasonry, usePositioner, useResizeObserver, useScroller } from 'masonic'
import { useWindowSize } from 'usehooks-ts'
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
  card: any,
  spacing?:number,
  masonry?:boolean
}

export const Grid = React.forwardRef(({masonry=true, spacing, children, data, card, columns, itemMinWidth = 200, gap }: GridProps, ref:any)  => {
  if (isWeb && data && card) {
    if(masonry) {
      const containerRef = React.useRef(null);
      const windowSize = useWindowSize();
      const { offset, width } = useContainerPosition(containerRef, [
        windowSize.width,
        windowSize.height
      ]);
      const { scrollTop, isScrolling } = useScroller(offset);
      const positioner = usePositioner(
        { width, columnGutter: spacing, columnWidth: itemMinWidth },
        [data.length]
      );
      const resizeObserver = useResizeObserver(positioner);
  
      return (
        // <Masonry positioner={positioner} resizeObservercolumnGutter={spacing} columnWidth={itemMinWidth} items={data} render={card} />
        useMasonry({
          positioner,
          scrollTop,
          isScrolling,
          height: windowSize.height,
          containerRef,
          items: data,
          // overscanBy: 5,
          resizeObserver,
          render: card
        })
      )
    } 

    return <XStack flexWrap='wrap'>
      {data.map(ele => {
        return React.createElement(card, {index: ele.index, data: {...ele}, width: itemMinWidth})
      })}
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
