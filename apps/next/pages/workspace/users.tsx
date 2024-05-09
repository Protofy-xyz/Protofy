import UsersPage from 'protolib/bundles/users/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Users</title>
      </Head>
      <UsersPage.users.component {...props} />
    </>
  )
}
