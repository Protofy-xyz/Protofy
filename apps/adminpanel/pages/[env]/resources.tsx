import ResourcesPage from 'protolib/bundles/resources/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Resources"}</title>
      </Head>
      <ResourcesPage.resources.component {...props} />
    </>
  )
}

export const getServerSideProps = ResourcesPage.resources.getServerSideProps