import {AdminPanel} from '../'
import Head from 'next/head'
import { useSession } from 'protolib'

export function AdminPage({workspace, pageSession, title, children}:any) {
    useSession(pageSession)
    return (
      <>
        <Head>
          <title>Admin &gt; {title}</title>
        </Head>
        <AdminPanel workspace={workspace}>
          {children}
        </AdminPanel>
      </>
    )
  }