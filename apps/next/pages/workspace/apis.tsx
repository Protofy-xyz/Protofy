import ApisPage from 'protolib/bundles/apis/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Apis</title>
      </Head>
      <ApisPage.apis.component {...props} />
    </>
  )
}

export const getServerSideProps = ApisPage.apis.getServerSideProps
