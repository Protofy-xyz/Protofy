import GroupsPage from 'protolib/bundles/groups/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'
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