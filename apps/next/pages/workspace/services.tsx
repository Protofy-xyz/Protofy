import ServicesPage from 'protolib/bundles/services/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Services</title>
      </Head>
      <ServicesPage.services.component {...props} />
    </>
  )
}

export const getServerSideProps = ServicesPage.services.getServerSideProps