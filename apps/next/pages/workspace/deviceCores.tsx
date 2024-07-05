import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceCores/**'].component
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Device Cores</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
