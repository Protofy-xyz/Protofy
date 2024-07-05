import GroupsPage from 'protolib/bundles/groups/adminPages'
import Head from 'next/head'
import { useRedirectToEnviron } from 'protolib/lib/useRedirectToEnviron'

export default function Page(props:any) {
  useRedirectToEnviron()
  return (
    <>
      <Head>
        <title>Protofy - Groups</title>
      </Head>
      <GroupsPage.groups.component {...props} />
    </>
  )
}

export const getServerSideProps = GroupsPage.groups.getServerSideProps