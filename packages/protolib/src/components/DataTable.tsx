import {
  H3,
  H4,
  ListItem,
  XStack,
  YStack,
} from 'tamagui'
import React from 'react'
import { useTint } from '../lib/Tints'


export const DataTable = React.forwardRef(({
  onRowPress = () => { },
  dataStyles = [],
  firstRowIsHeader,
  title = '',
  rows,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  onRowPress?: any,
  dataStyles?: any[],
  firstRowIsHeader?: boolean,
  title?: string
  rows: string[][]
  'aria-label'?: string
  'aria-labelledby'?: string
}, ref: any) => {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  const { tint } = useTint()
  return (
    <YStack
      ref={ref}
      borderWidth={1}
      borderColor="$borderColor"
      flex={1}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      marginVertical="$4"
      borderRadius="$4"
      overflow="hidden"
      $sm={{
        //@ts-ignore
        marginHorizontal: 0,
      }}
    >
      {!!title && (
        //@ts-ignore
        <XStack alignItems="center" paddingVertical="$2" paddingHorizontal="$4" backgroundColor="$borderColor">
          <H3 size="$3">{title}</H3>
        </XStack>
      )}

      {rows.map((items, x) => (
        //@ts-ignore
        <ListItem key={x} padding={0}>
          <XStack
            //@ts-ignore
            flex={1}
            alignItems="center"
            position="relative"
            paddingVertical="$3"
            paddingHorizontal="$4"
            justifyContent="space-around"
            $sm={{ flexDirection: 'column' }}
            backgroundColor={x % 2 ? "$backgroundHover" : "$background"}
            cursor='pointer'
            borderColor={'$borderColor'}
            borderBottomWidth={x === 0 ? 1 : 0}
            hoverStyle={x === 0 ? {} : { backgroundColor: '$' + tint + '3' }}
            onPress={() => x !== 0 ? onRowPress(items) : null}
          >
            {items.map((item, i) => (
              <H4
                color="$color"
                //@ts-ignore
                fow="700"
                key={item}
                //@ts-ignore
                maxWidth={100}
                fontFamily="$mono"
                textTransform="none"
                //@ts-ignore
                alignItems="center" justifyContent="center"
                textAlign="center"
                size="$4"
                //@ts-ignore
                flex={1}
                fontWeight={x == 0 && firstRowIsHeader ? "bold" : "normal"}
                {...(dataStyles && dataStyles[i] ? dataStyles[i] : {})}
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
