import ResourcesPage from 'protolib/bundles/resources/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Resources</title>
      </Head>
      <ResourcesPage.resources.component {...props} />
    </>
  )
}
