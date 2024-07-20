import UsersPage from 'protolib/dist/bundles/users/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/dist/lib/useRedirectToEnviron'
import { SiteConfig } from 'app/conf'

export default function Page(props:any) {
  useRedirectToEnviron()
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

export const getServerSideProps = UsersPage.users.getServerSideProps
