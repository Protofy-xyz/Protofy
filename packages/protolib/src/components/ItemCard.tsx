import { FastForward, Pause, Rewind } from '@tamagui/lucide-icons'
import React, { memo, useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardProps,
  Image,
  ImageProps,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Square,
  Stack,
  StackProps,
  Theme,
  ThemeName,
  XStack,
  YStack,
  YStackProps,
} from 'tamagui'
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
        flex={1}
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
              backgroundColor="$backgroundHover"
              borderTopRightRadius={10}
              borderTopLeftRadius={10}
             justifyContent="center"
              {...topBarProps}
            >
              {topBar}
            </XStack>
            {/*@ts-ignore*/}
            <Separator marginBottom={-1} />
          </>
        ) : null}
        {React.createElement(containerElement as any, {
          borderWidth: 1,
          borderColor: "$borderColor",
          backgroundColor: "$color1",
           borderRadius: "$5",
          padding: 0,
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
                paddingHorizontal="$2"
                paddingVertical="$2"
                backgroundColor="$backgroundHover"
                borderTopRightRadius={10}
                borderTopLeftRadius={10}
                space="$5"
               justifyContent="center"
                {...topBarProps}
              >
                {topBar}
              </XStack>
              {/*@ts-ignore*/}
              <Separator marginBottom={-1} />
            </>
          ) : null,

          <YStack alignItems="center">
            {/*@ts-ignore*/}
            {hasPicture ? <Center>
              {image && image.src && !error ? <Image onError={() => setError(true)} borderTopRightRadius={20} borderTopLeftRadius={20} top={-20} source={{ uri: image.src, width: image.width, height: image.height }} /> :
                <YStack opacity={0.2} borderTopRightRadius={20} borderTopLeftRadius={20} width={image?.width} height={image?.height} justifyContent="center" alignItems="center">
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
              <Separator marginBottom={-1} />

              <XStack
                //@ts-ignore
                zi={1000}
                w="100%"
                paddingHorizontal="$2"
                paddingVertical="$2"
                backgroundColor="$backgroundHover"
                borderBottomRightRadius={17}
                bblr={17}
                alignItems="center"
                space="$5"
               justifyContent="center"
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
