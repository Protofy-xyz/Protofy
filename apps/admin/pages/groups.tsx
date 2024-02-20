import GroupsPage from 'protolib/bundles/groups/adminPages'
import Head from 'next/head'

export default function Page(props:any) {
  return (
    <>
      <Head>
        <title>Protofy - Groups</title>
      </Head>
      <GroupsPage.groups.component {...props} />
    </>
  )
}
