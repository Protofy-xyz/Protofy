import FilesPage from 'protolib/bundles/files/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Files"}</title>
      </Head>
      <FilesPage.files.component {...props} />
    </>
  )
}

export const getServerSideProps = FilesPage.files.getServerSideProps
