import DashboardPage from 'protolib/bundles/dashboard/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Dashboard"}</title>
      </Head>
      <DashboardPage.dashboard.component {...props} />
    </>
  )
}

export const getServerSideProps = DashboardPage.dashboard.getServerSideProps