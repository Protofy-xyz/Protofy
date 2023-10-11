import {AdminPanel} from '../../../features'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import { useRouter } from 'next/router';
import ListEvents from '../components/ListEvents'
import { useSession } from '../../../../lib/Session'

export default function EventsListPage({workspace, initialUsers, pageSession}:any) {
  useSession(pageSession)
  return (
    <>
      <Head>
        <title>Admin &gt; Events</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <ListEvents />
      </AdminPanel>
    </>
  )
}

export const serverExecuted = SSR(async (context:NextPageContext) => {
    return withSession(context, ['admin'], {
      workspace: await API.get('/adminapi/v1/workspaces')
    })
})
