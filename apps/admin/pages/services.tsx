import ServicesPage from 'protolib/bundles/services/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Services</title>
      </Head>
      <ServicesPage.services.component {...props} />
    </>
  )
}
