import ServicesPage from 'protolib/src/bundles/services/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Services"}</title>
      </Head>
      <ServicesPage.services.component {...props} />
    </>
  )
}

export const getServerSideProps = ServicesPage.services.getServerSideProps