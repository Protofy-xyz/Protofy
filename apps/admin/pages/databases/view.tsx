import ResourcesPage from 'protolib/bundles/databases/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  const PageComponent = ResourcesPage['databases/view'].component
  return (
    <>
      <Head>
        <title>Protofy - View Database</title>
      </Head>
      <PageComponent {...props} />
    </>
  )
}
