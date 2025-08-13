import ApisPage from '@extensions/apis/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props: any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Tasks"}</title>
      </Head>
      <ApisPage.apis.component {...props} />
    </>
  )
}