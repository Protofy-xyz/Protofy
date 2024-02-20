import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceSdks/**'].component
  return (
    <>
      <Head>
        <title>Protofy - Devices SDK</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
