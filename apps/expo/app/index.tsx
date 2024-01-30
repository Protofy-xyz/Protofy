import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { setConfig } from 'protolib/base/Config';
import {getBaseConfig} from 'app/BaseConfig'
setConfig({...getBaseConfig(process), logger: {...getBaseConfig(process).logger, name: "expo"}})

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
