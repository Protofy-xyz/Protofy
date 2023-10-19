import { FastForward, Pause, Rewind } from '@tamagui/lucide-icons'
import React, { memo, useMemo } from 'react'
import {
  Button,
  Card,
  CardProps,
  Image,
  ImageProps,
  Paragraph,
  ScrollView,
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
      topBarProps?: StackProps,
      bottomBarProps?: StackProps,
      bottomBar?: any
      imageSrc?: string,
      alt?: number | null
      onHoverSection?: (name: string) => void
      pointerEventsControls?: any
      imageProps?: ImageProps,
      children?: any,
      topBar?: any,
      topBarOutSideScrollArea?: boolean,
      containerElement?: any,
      stackProps: any
    }, ref:any
  ) => {
    const {
      containerElement = ScrollView,
      topBarOutSideScrollArea = false,
      bottomBarProps = {},
      bottomBar,
      topBarProps = {},
      topBar,
      children,
      imageProps = {},
      imageSrc = '',
      theme,
      alt,
      onHoverSection,
      pointerEvents,
      pointerEventsControls,
      stackProps,
      ...cardProps
    } = props
    const tint = !alt ? null : (`alt${alt}` as ThemeName)

    return (
      <YStack
        f={1}
        ref={ref}
        display="flex"
        alignItems="stretch"
      >
        <Theme name={tint}>
          
        {topBarOutSideScrollArea && topBar ? (
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
                  {...topBarProps}
                >
                  {topBar}
                </XStack>
                {/*@ts-ignore*/}
                <Separator mb={-1} />
              </>
            ) : null}
          {React.createElement(containerElement as any, {
            borderWidth: 1,
            borderColor: "$borderColor",
            backgroundColor: "$color1",
            br: "$7",
            p: 0,
            ai: "stretch",
            elevation: "$2",
            stackProps,
            ...cardProps
          }, [
            !topBarOutSideScrollArea && topBar ? (
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
                  {...topBarProps}
                >
                  {topBar}
                </XStack>
                {/*@ts-ignore*/}
                <Separator mb={-1} />
              </>
            ) : null,

            <XStack ai="center" p="$4" f={1} {...stackProps}>
              {/*@ts-ignore*/}
              {imageSrc ? <Square pos="relative" ov="hidden" br="$6" size="$8">
                <Image {...imageProps} source={{ uri: imageSrc, width: 90, height: 90 }} />
              </Square> : null}
                {children}
            </XStack>,
            bottomBar ? (
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
            ) : null
          ])}
        </Theme>
      </YStack>
    )
  }
))
