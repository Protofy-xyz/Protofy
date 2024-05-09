import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceBoards/**'].component
  return (
    <>
      <Head>
        <title>Protofy - Device Boards</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
