import PagesPage from '@extensions/pages/adminPages'
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