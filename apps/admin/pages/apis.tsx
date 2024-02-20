import ApisPage from 'protolib/bundles/apis/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Apis</title>
      </Head>
      <ApisPage.apis.component {...props} />
    </>
  )
}
