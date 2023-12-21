import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = DevicesPages['devices/**'].component
  return (
    <>
      <Head>
        <title>Protofy - Devices</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
