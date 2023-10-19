import { isWeb } from '@tamagui/core'
import { XStack } from '@tamagui/stacks'
import React from 'react'
import { Masonry } from "masonic";

export type GridProps = {
  children?: any
  itemMinWidth?: number
  gap?: any
  columns?: number
  data?:any
  card: any
}

export const Grid = React.forwardRef(({ spacing, children, data, card, columns, itemMinWidth = 200, gap }: GridProps, ref:any)  => {
  if (isWeb && data && card) {
    return (
      <Masonry columnGutter={spacing} columnWidth={itemMinWidth} items={data} render={card} />
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
