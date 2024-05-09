import ObjectsPage from 'protolib/bundles/objects/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Objects</title>
      </Head>
      <ObjectsPage.objects.component {...props} />
    </>
  )
}
