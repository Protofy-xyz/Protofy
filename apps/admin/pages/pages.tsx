import PagesPage from 'protolib/bundles/pages/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Pages</title>
      </Head>
      <PagesPage.pages.component {...props} />
    </>
  )
}
