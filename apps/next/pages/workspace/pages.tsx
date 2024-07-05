import PagesPage from 'protolib/bundles/pages/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Pages</title>
      </Head>
      <PagesPage.pages.component {...props} />
    </>
  )
}

export const getServerSideProps = PagesPage.pages.getServerSideProps
