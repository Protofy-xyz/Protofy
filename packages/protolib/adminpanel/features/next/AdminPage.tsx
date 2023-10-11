import {AdminPanel} from '../'
import Head from 'next/head'
import { useSession } from 'protolib'

export function AdminPage({workspace, pageSession, children}:any) {
    useSession(pageSession)
    return (
      <>
        <Head>
          <title>Admin &gt; Users</title>
        </Head>
        <AdminPanel workspace={workspace}>
          {children}
        </AdminPanel>
      </>
    )
  }