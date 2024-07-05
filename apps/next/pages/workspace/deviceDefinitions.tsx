import DevicesPages from 'protolib/bundles/devices/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  const PageComponent = DevicesPages['deviceDefinitions/**'].component
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Device Definitions</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}

export const getServerSideProps = DevicesPages['deviceDefinitions/**'].getServerSideProps
