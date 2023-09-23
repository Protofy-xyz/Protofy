import { FastForward, Pause, Rewind } from '@tamagui/lucide-icons'
import React, { memo, useMemo } from 'react'
import {
  Button,
  Card,
  CardProps,
  Image,
  ImageProps,
  Paragraph,
  Separator,
  Square,
  StackProps,
  Theme,
  ThemeName,
  XStack,
  YStack,
  YStackProps,
} from 'tamagui'
export const ItemCard = memo(React.forwardRef(
  (
    props: YStackProps & {
      bottomBarProps?: StackProps,
      bottomBar?: any
      imageSrc?: string,
      alt?: number | null
      onHoverSection?: (name: string) => void
      pointerEventsControls?: any
      imageProps?: ImageProps,
      children?: any,
      topBar?: any
    }, ref:any
  ) => {
    const {
      bottomBarProps = {},
      bottomBar,
      topBar,
      children,
      imageProps = {},
      imageSrc = '',
      theme,
      alt,
      onHoverSection,
      pointerEvents,
      pointerEventsControls,
      ...cardProps
    } = props
    const tint = !alt ? null : (`alt${alt}` as ThemeName)

    return (
      <YStack
      ref={ref}
        display="flex"
        alignItems="stretch"
      >
        <Theme name={tint}>
          <YStack
            overflow="visible"
            borderWidth={1}
            borderColor="$borderColor"
            backgroundColor="$color1"
            //@ts-ignore
            br="$7"
            p={0}
            ai="stretch"
            // mb={40}
            elevation="$2"
            {...cardProps}
          >

            {topBar ? (
              <>
                <XStack
                  //@ts-ignore
                  zi={1000}
                  w="100%"
                  px="$2"
                  py="$2"
                  bc="$backgroundHover"
                  btrr={18}
                  btlr={18}
                  space="$5"
                  jc="center"
                >
                  {topBar}
                </XStack>
                {/*@ts-ignore*/}
                <Separator mb={-1} />
              </>
            ) : null}
            {/*@ts-ignore*/}
            <XStack ai="center" p="$4">
              {/*@ts-ignore*/}
              {imageSrc ? <Square pos="relative" ov="hidden" br="$6" size="$8">
                <Image {...imageProps} source={{ uri: imageSrc, width: 90, height: 90 }} />
              </Square> : null}

              {children}
            </XStack>
            {bottomBar ? (
              <>
                {/*@ts-ignore*/}
                <Separator mb={-1} />

                <XStack
                  //@ts-ignore
                  zi={1000}
                  w="100%"
                  px="$2"
                  py="$2"
                  bc="$backgroundHover"
                  bbrr={17}
                  bblr={17}
                  ai="center"
                  space="$5"
                  jc="center"
                  pointerEvents={pointerEvents}
                  {...bottomBarProps}
                >
                  {bottomBar}
                </XStack>

              </>
            ) : null}

          </YStack>
        </Theme>
      </YStack>
    )
  }
))
