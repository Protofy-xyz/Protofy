import PagesPage from 'protolib/dist/bundles/pages/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/dist/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
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
