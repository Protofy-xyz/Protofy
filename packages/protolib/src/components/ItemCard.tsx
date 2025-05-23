import React, { memo, useState } from 'react'
import {
  Image,
  ImageProps,
  Separator,
  SizableText,
  StackProps,
  ThemeName,
  XStack,
  YStack,
  YStackProps,
} from '@my/ui'
import Center from './Center'
import { ImageOff } from '@tamagui/lucide-icons'

export const ItemCard = memo(React.forwardRef(
  (
    props: YStackProps & {
      topBarProps?: StackProps,
      bottomBarProps?: StackProps,
      bottomBar?: any
      image?: { src: string, width: number, height: number } | null,
      alt?: number | null
      onHoverSection?: (name: string) => void
      pointerEventsControls?: any
      imageProps?: ImageProps,
      children?: any,
      topBar?: any,
      topBarOutSideScrollArea?: boolean,
      containerElement?: any,
      hasPicture?: boolean
    }, ref: any
  ) => {
    const {
      containerElement = YStack,
      topBarOutSideScrollArea = false,
      bottomBarProps = {},
      bottomBar,
      topBarProps = {},
      topBar,
      children,
      imageProps = {},
      image = null,
      hasPicture,
      theme,
      alt,
      onHoverSection,
      pointerEvents,
      pointerEventsControls,
      ...cardProps
    } = props
    const tint = !alt ? null : (`alt${alt}` as ThemeName)
    const [error, setError] = useState(false)
    return (
      <YStack
        f={1}
        ref={ref}
        display="flex"
        alignItems="stretch"
      >
        {topBarOutSideScrollArea && topBar ? (
          <>
            <XStack
              //@ts-ignore
              zi={1000}
              w="100%"
              bc="$backgroundHover"
              btrr={10}
              btlr={10}
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
          br: "$5",
          p: 0,
          ai: "stretch",
          elevation: "$2",
          overflow: 'hidden',
          ...cardProps
        },
          !topBarOutSideScrollArea && topBar ? (
            <>
              <XStack
                //@ts-ignore
                zi={1000}
                w="100%"
                px="$2"
                py="$2"
                bc="$backgroundHover"
                btrr={10}
                btlr={10}
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

          <YStack ai="center">
            {/*@ts-ignore*/}
            {hasPicture ? <Center>
              {image && image.src && !error ? <Image onError={() => setError(true)} btrr={20} btlr={20} top={-20} source={{ uri: image.src, width: image.width, height: image.height }} /> :
                <YStack o={0.2} btrr={20} btlr={20} width={image?.width} height={image?.height} jc="center" ai="center">
                  <ImageOff />
                  <SizableText>No photo</SizableText>
                </YStack>
              }
            </Center> : <></>}
          </YStack>,
          children,
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
        )}
      </YStack>
    )
  }
))
