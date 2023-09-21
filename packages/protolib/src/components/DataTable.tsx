import {
  H3,
  H4,
  ListItem,
  XStack,
  YStack,
} from 'tamagui'
import React from 'react'


export const DataTable = React.forwardRef(({
  title = '',
  rows,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  title?: string
  rows: string[][]
  'aria-label'?: string
  'aria-labelledby'?: string
}, ref:any) => {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)  
  return (
      <YStack
        ref={ref}
        borderWidth={1}
        borderColor="$borderColor"
        f={1}
        aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
        aria-labelledby={ariaLabelledBy}
        my="$4"
        br="$4"
        ov="hidden"
        $sm={{
          //@ts-ignore
          mx: 0,
        }}
      >
        {!!title && (
          //@ts-ignore
          <XStack f={1} ai="center" py="$2" px="$4" backgroundColor="$borderColor">
            <H3 size="$3">{title}</H3>
          </XStack>
        )}

        {rows.map((items, i) => (
          //@ts-ignore
          <ListItem key={i} p={0}>
            <XStack
              //@ts-ignore
              f={1}
              ai="center"
              pos="relative"
              py="$3"
              px="$4"
              jc="space-around"
              $sm={{ flexDirection: 'column' }}
              bc={i%2?"$backgroundStrong":"$background"}
            >
              {items.map((item, i) => (
                <H4
                  color="$color"
                  //@ts-ignore
                  fow="700"
                  key={item}
                  //@ts-ignore
                  maw={100}
                  fontFamily="$mono"
                  textTransform="none"
                  //@ts-ignore
                  ai="center" jc="center"
                  textAlign="center"
                  size="$4"
                  //@ts-ignore
                  f={1}
                >
                  {item}
                </H4>
              ))}
            </XStack>
          </ListItem>
        ))}
      </YStack>
  )
})
