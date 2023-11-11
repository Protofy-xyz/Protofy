import { DefaultLayout } from 'app/layout/DefaultLayout'
import { AlertTriangle } from '@tamagui/lucide-icons'
import {Page, useEdit} from 'protolib'
import { Protofy } from 'protolib/base'
import { Theme, YStack, Text, Spacer, XStack, Paragraph,H2 } from "@my/ui"


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

export default {
    route: Protofy("route", "/404"),
    component: () => useEdit(NotFound, {
		DefaultLayout,
		YStack,
		Spacer,
		Text,
		XStack,
		Paragraph,
		Theme, 
        H2,
        AlertTriangle
	}, "/packages/app/bundles/custom/pages/notFound.tsx")
}