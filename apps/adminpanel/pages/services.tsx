import ServicesPage from 'protolib/bundles/services/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
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