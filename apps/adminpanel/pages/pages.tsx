import PagesPage from 'protolib/bundles/pages/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Pages"}</title>
      </Head>
      <PagesPage.pages.component {...props} />
    </>
  )
}

export const getServerSideProps = PagesPage.pages.getServerSideProps
