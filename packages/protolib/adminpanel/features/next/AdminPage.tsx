import {AdminPanel} from '../'
import Head from 'next/head'
import { useSession } from 'protolib'
import Workspaces from 'app/bundles/workspaces'
 
export function AdminPage({workspace, pageSession, title, children}:any) {
  console.log("WORSKPACEEEEEEEEEEEEEEEE", Workspaces.basic)
    useSession(pageSession)
    return (
      <>
        <Head>
          <title>Admin &gt; {title}</title>
        </Head>
        <AdminPanel workspace={Workspaces.basic}>
          {children}
        </AdminPanel>
      </>
    )
  }