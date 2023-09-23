import { DefaultLayout } from '@/layout/DefaultLayout'
import { H2, Spinner, YStack } from 'tamagui'
import { useSubscription } from 'mqtt-react-hooks';
import { AlertTriangle } from '@tamagui/lucide-icons';
import {Center, Page} from 'protolib'

export default function MQTT() {
  const { topic, client, message } = useSubscription('test');
  return (
    <Page>
      <DefaultLayout header={null} footer={null}>
        <Center>
          <Spinner size={"large"} scale={2} />
          <H2 mt={"$10"}>{message?message.message:'Waiting for messages on topic test...'}</H2>
        </Center>
      </DefaultLayout>
    </Page>

  )
}