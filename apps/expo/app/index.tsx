import { Stack } from 'expo-router'
import { setConfig } from 'protolib/base/Config';
import { getBaseConfig } from 'app/BaseConfig';
import { MyComponent } from 'app/bundles/custom/expo/my-screen';

setConfig({ ...getBaseConfig('expo', process), logger: { ...getBaseConfig('expo', process).logger } })

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <MyComponent />
    </>
  )
}
