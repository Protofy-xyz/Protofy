import ResourcesPage from 'protolib/bundles/resources/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Resources</title>
      </Head>
      <ResourcesPage.resources.component {...props} />
    </>
  )
}
