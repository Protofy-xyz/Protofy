import { DefaultLayout } from 'app/layout/DefaultLayout'
import { AlertTriangle } from '@tamagui/lucide-icons'
import {Page} from 'protolib'
import { Protofy } from 'protolib/base'
import { Theme, YStack, Text, XStack, Paragraph,H2 } from "@my/ui"
import React, { useState } from 'react'
import { UIWrapLib, UIWrap, withSession, useEditor, SSR } from "protolib"

const isProtected = Protofy("protected", false)

const NotFound = () => {
  return (
    <Page height="100vh">
      <DefaultLayout>
        <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
          <AlertTriangle size="$7" />
          <H2>404 - Page Not Found</H2>
        </YStack>
      </DefaultLayout>
    </Page>
  )
}

const cw = UIWrapLib('@my/ui')

export default {
    route: Protofy("route", "/404"),
    component: NotFound,
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions", []):undefined))
}