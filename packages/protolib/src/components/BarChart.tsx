import { Paragraph, XStack, YStack } from 'tamagui'
import React from 'react'


const BarChart = React.forwardRef(({
  data,
  large,
  unit = 'ms',
  animateEnter = false,
  selectedElement = ''
}:any, ref) => {
  const maxValue = Math.max(...data.map((r) => r.value))

  return (
    //@ts-ignore
    <YStack space="$2" my="$4" ref={ref}>
      {data.map((result, i) => {
        const width = `${Math.round((result.value / maxValue) * 100)}%`
        return (
          <XStack space="$3" key={i}>
            {/*@ts-ignore*/}
            <YStack w={large ? 120 : 70}>
              <Paragraph
                key={result.name}
                size="$2"
                whiteSpace="nowrap"
                //@ts-ignore
                ta="right"
                //@ts-ignore
                my={-3}
                fontWeight={result.name === selectedElement ? '700' : '400'}
              >
                {result.name}
              </Paragraph>
            </YStack>
            <XStack marginRight={65} flex={1} alignItems="center">
              <YStack
                //@ts-ignore
                bc={result.color}
                o={1}
                width={width as any}
                height={20}
                br="$2"
                position="relative"
                jc="center"
                scaleX={1}
                {...(animateEnter && {
                  animation: 'lazy',
                  enterStyle: {
                    opacity: 0,
                    scaleX: 0,
                  },
                })}
              >
                <Paragraph
                  size="$1"
                  whiteSpace="nowrap"
                  position="absolute"
                  right="$-2"
                  x="100%"
                >
                  {result.value}{unit}
                </Paragraph>
              </YStack>
            </XStack>
          </XStack>
        )
      })}
    </YStack>
  )
})

export default BarChart
