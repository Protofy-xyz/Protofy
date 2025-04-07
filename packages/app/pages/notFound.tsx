import { DefaultLayout } from 'app/layout/DefaultLayout'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { Page } from 'protolib/components/Page'
import { Protofy } from 'protobase'
import { YStack, H2 } from "@my/ui"
import {withSession } from "protolib/lib/Session"
import {SSR} from 'protolib/lib/SSR'

const isProtected = Protofy("protected", false)
const permissions = Protofy("permissions", null)
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
    component: NotFound
}