import KeysPage from 'protolib/bundles/keys/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Keys</title>
      </Head>
      <KeysPage.keys.component {...props} />
    </>
  )
}
