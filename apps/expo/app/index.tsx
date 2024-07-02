import { Paragraph, XStack } from '@my/ui'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <XStack>
        <Paragraph>hello</Paragraph>
      </XStack>
    </>
  )
}
