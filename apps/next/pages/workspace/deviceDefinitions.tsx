import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceDefinitions/**'].component
  return (
    <>
      <Head>
        <title>Protofy - Device Definitions</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
