import UsersPage from '@extensions/users/adminPages'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  const projectName = SiteConfig.projectName

  return (
    <>
      <Head>
        <title>{projectName + " - Users"}</title>
      </Head>
      <UsersPage.users.component {...props} />
    </>
  )
}
