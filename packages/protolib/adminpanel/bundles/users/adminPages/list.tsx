import AdminPanel from '../../../features'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import { useRouter } from 'next/router';
import ListUsers from '../components/ListUsers'
import { useSession } from '../../../../lib/Session'

export default function ListUsersPage({workspace, initialUsers, pageSession}:any) {
  useSession(pageSession)
  return (
    <>
      <Head>
        <title>Admin &gt; Users</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <ListUsers initialItems={initialUsers}/>
      </AdminPanel>
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    return withSession(context, ['admin'], {
      workspace: await API.get('/adminapi/v1/workspaces'),
      initialUsers: await API.get('/adminapi/v1/accounts')
    })
})
