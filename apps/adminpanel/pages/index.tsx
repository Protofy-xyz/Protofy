import DashboardPage from '@extensions/boards/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Dashboard"}</title>
      </Head>
      <DashboardPage.boards.component {...props} />
    </>
  )
}