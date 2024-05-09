import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceBoards/**'].component
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Device Boards</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
