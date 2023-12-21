import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceCores/**'].component
  return (
    <>
      <Head>
        <title>Protofy - Device Cores</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
