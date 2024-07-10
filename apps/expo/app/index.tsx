import { Paragraph, XStack } from '@my/ui'
import Center  from 'protolib/src/components/Center'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <Center>
        <Paragraph>
          hello world
        </Paragraph>
      </Center>
    </>
  )
}
