import ResourcesPage from 'protolib/bundles/databases/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = ResourcesPage['databases'].component
  return (
    <>
      <Head>
        <title>Protofy - Databases</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
