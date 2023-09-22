import React from 'react'
import { H3, Paragraph, SizableText, XStack, YStack } from 'tamagui'

import { FancyCard } from './FancyCard'

export const TamaCard = React.forwardRef(({
  title,
  icon,
  subtitlePre,
  subtitlePost,
  footer,
  children,
  grow,
  width='auto',
}: any, ref:any) => {
  // const shadow = useHoverGlow({
  //   resist: 92,
  //   borderRadius: 0,
  //   strategy: 'blur',
  //   blurPct: 4,
  //   initialOffset: {
  //     y: -100,
  //   },
  //   full: true,
  //   scale: 1,
  //   background: 'transparent',
  //   opacity: 1,
  //   inverse: true,
  // })
  // const glow = useHoverGlow({
  //   resist: 0,
  //   size: 300,
  //   color: 'var(--color)',
  //   opacity: 0.18,
  //   style: {
  //     zIndex: -1,
  //   },
  // })
  // const containerRef = useComposedRefs<any>(glow.parentRef, shadow.parentRef)
  return (
    <YStack
    ref={ref}
      width={width}
      className="transition all ease-in ms100"
      position="relative"
      $sm={{ width: 'auto', minWidth: '100%' }}
      padding="$3"
      hoverStyle={{
        zIndex: 1000,
      }}
      flex={grow?1:0}
    >
      {/* shadow */}
      {/* {shadow.element} */}
      <FancyCard
        // ref={containerRef}
        overflow="hidden"
        y={0}
      >
        {/* glow */}
        {/* @ts-ignore */}
        <XStack bc="$backgroundStrong" f={1} p="$5" m={1} br="$6" space>
          <YStack flex={1} space="$2" alignItems="center">
            <H3
              alignSelf="flex-start"
              fontFamily="$silkscreen"
              size="$7"
              //@ts-ignore
              fow="200"
              color="$color"
              cursor="default"
              letterSpacing={1}
            >
              {title}
            </H3>

            {!!(subtitlePre || subtitlePost) && (
              <XStack>
                {!!subtitlePre && (
                  <Paragraph cursor="default" tag="time" size="$7" theme="alt2">
                    {subtitlePre}
                  </Paragraph>
                )}
                {!!subtitlePost && (
                  //@ts-ignore
                  <Paragraph cursor="default" fow="700" theme="alt2" size="$7">
                    {subtitlePost}
                  </Paragraph>
                )}
              </XStack>
            )}


            {children}
            {/* @ts-ignore */}
            <Paragraph opacity={0.65} cursor="default" theme="alt2" size="$4" fow="500">
              {footer}
            </Paragraph>
          </YStack>

          <SizableText>{icon}</SizableText>
        </XStack>
      </FancyCard>
    </YStack>
  )
})
