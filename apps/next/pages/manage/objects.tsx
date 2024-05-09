import ObjectsPage from 'protolib/bundles/objects/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Objects</title>
      </Head>
      <ObjectsPage.objects.component {...props} />
    </>
  )
}
