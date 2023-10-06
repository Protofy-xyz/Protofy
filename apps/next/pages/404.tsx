import { DefaultLayout } from 'app/layout/DefaultLayout'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { H2, YStack } from 'tamagui'
import {Page, useSession} from 'protolib'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { withSession } from 'protolib'

export default function Custom404(props:any) {
  useSession(props.pageSession)
  return (
    <Page>
      <DefaultLayout>
        <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
          <AlertTriangle size="$7" />
          <H2>404 - Page Not Found</H2>
        </YStack>
      </DefaultLayout>
    </Page>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => withSession(context))