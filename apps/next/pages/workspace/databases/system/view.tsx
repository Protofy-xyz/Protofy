import DatabasesPage from 'protolib/src/bundles/databases/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const PageComponent = DatabasesPage['databases/view'].component
  const projectName = SiteConfig.projectName
  
  return (
    <>
      <Head>
        <title>{projectName + " - View System Database"}</title>
      </Head>
      <PageComponent env="system" {...props} />
    </>
  )
}

export const getServerSideProps = DatabasesPage['databases/view'].getServerSideProps