import FilesPage from 'protolib/src/bundles/files/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
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
