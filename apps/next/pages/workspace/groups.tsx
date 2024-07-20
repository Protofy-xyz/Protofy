import GroupsPage from 'protolib/dist/bundles/groups/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/dist/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Groups"}</title>
      </Head>
      <GroupsPage.groups.component {...props} />
    </>
  )
}

export const getServerSideProps = GroupsPage.groups.getServerSideProps