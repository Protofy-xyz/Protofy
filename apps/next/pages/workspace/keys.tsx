import KeysPage from 'protolib/bundles/keys/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Keys</title>
      </Head>
      <KeysPage.keys.component {...props} />
    </>
  )
}
