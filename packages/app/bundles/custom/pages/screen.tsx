import { DefaultLayout } from 'app/layout/DefaultLayout'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { Protofy } from 'protobase'
import { Theme, YStack, Text, Spacer, XStack, Paragraph, H2 } from "@my/ui"
import { withSession } from "protolib/lib/Session"
import { useEdit } from 'protolib/visualui/useEdit'
import { Page } from 'protolib/components/Page'
import { SSR } from 'protolib/lib/SSR'

const isProtected = Protofy("protected", false)

const Screen = () => {
  return (
    <Page height="100vh">
      <DefaultLayout footer={null} header={null}>
        <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
          <AlertTriangle size="$7" />
          <H2>Protofy</H2>
        </YStack>
      </DefaultLayout>
    </Page>
  )
}

export default {
    route: Protofy("route", "/screen"),
    component: () => useEdit(Screen, {
		DefaultLayout,
		YStack,
		Spacer,
		Text,
		XStack,
		Paragraph,
		Theme, 
        H2,
        AlertTriangle
	}, "/packages/app/bundles/custom/pages/notFound.tsx"),
    getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined)),
}