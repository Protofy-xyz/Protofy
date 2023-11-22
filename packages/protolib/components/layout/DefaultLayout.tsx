import { AppBar, Tinted } from 'protolib'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
// import { NextSeo } from 'next-seo'
import React from 'react'
import { Stack, StackProps, XStack, YStack } from 'tamagui'
import { Toast, useToastState } from '@my/ui'

const ToastArea = () => {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="100ms"
      viewportName={currentToast.viewportName}
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}

export const DefaultLayout = React.forwardRef(({
  children,
  sideMenu = null,
  footer,
  header,
  seoProps = {},
  title = "Protofy",
  description = "Protofy",
  openGraph = {
    type: 'website',
    locale: 'en_US',
    url: 'https://protofy.xyz',
    siteName: 'Protofy',
    images: [
      {
        url: 'https://protofy.xyz/social.png',
      },
    ],
  },
  ...props
}: {
  sideMenu?: React.ReactNode | null,
  children: React.ReactNode,
  footer?: React.ReactNode,
  header?: React.ReactNode,
  seoProps?: any,
  title?: string
  description?: string,
  openGraph?: any
} & StackProps, ref: any) => {
  return (
    <Stack f={1} ref={ref} height="100%" {...props}>
      {/* <NextSeo
        title={title}
        description={description}
        openGraph={openGraph}
        {...seoProps}
      /> */}

      <ToastProvider swipeDirection="horizontal">
          <Tinted><ToastArea /></Tinted>
          {header}
          <XStack f={1}>
            {sideMenu}
            <YStack f={1}>
              {children}
            </YStack>

          </XStack>

          {footer}

          <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
          <ToastViewport
            multipleToasts
            name="viewport-multiple"
            flexDirection="column-reverse"
            top="$2"
            left={0}
            right={0}
          />

      </ToastProvider>
    </Stack>
  )
})
