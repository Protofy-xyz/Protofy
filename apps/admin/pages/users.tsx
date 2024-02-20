import UsersPage from 'protolib/bundles/users/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Users</title>
      </Head>
      <UsersPage.users.component {...props} />
    </>
  )
}
