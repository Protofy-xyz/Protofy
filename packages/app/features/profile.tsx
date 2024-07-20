import { DefaultLayout } from '../layout/DefaultLayout'
import { H2, YStack } from 'tamagui'
import { useSession} from 'protolib/dist/lib/Session'
import {Page} from 'protolib/dist/components/Page'

export function Profile({pageSession}) {
  const [session] = useSession(pageSession)
  return (
    <Page>
      <DefaultLayout>
        <YStack flex={1} ai="center" jc="center" space="$4">
          <H2>Profile {session.user.id}</H2>
        </YStack>
      </DefaultLayout>
    </Page>
  )
}