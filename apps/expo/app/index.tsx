import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import {setLoggerConfig} from 'protolib/base';

setLoggerConfig({name: "expo"})

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <HomeScreen />
    </>
  )
}
