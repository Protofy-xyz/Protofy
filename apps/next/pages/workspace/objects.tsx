import ObjectsPage from 'protolib/bundles/objects/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Objects"}</title>
      </Head>
      <ObjectsPage.objects.component {...props} />
    </>
  )
}

export const getServerSideProps = ObjectsPage.objects.getServerSideProps