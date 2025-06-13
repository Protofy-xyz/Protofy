import GroupsPage from '@extensions/groups/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
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