import MobilePage from 'protolib/bundles/mobile/mobilePage'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Mobile"}</title>
      </Head>
      <MobilePage.component {...props} />
    </>
  )
}

export const getServerSideProps = MobilePage.getServerSideProps