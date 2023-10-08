import {
  H3,
  H4,
  ListItem,
  XStack,
  YStack,
} from 'tamagui'
import React from 'react'


export const DataTable = React.forwardRef(({
  dataStyles=[],
  firstRowIsHeader,
  title = '',
  rows,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  dataStyles?: any[],
  firstRowIsHeader?: boolean,
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
          <XStack ai="center" py="$2" px="$4" backgroundColor="$borderColor">
            <H3 size="$3">{title}</H3>
          </XStack>
        )}

        {rows.map((items, x) => (
          //@ts-ignore
          <ListItem key={x} p={0}>
            <XStack
              //@ts-ignore
              f={1}
              ai="center"
              pos="relative"
              py="$3"
              px="$4"
              jc="space-around"
              $sm={{ flexDirection: 'column' }}
              bc={x%2?"$backgroundPress":"$background"}
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
                  fontWeight={x==0 && firstRowIsHeader?"bold": "normal"}
                  {...(dataStyles && dataStyles[i] ? dataStyles[i]:{})}
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
