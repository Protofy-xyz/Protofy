import {AdminPanel} from '../'

import { useSession, Page } from 'protolib'
import Workspaces from 'app/bundles/workspaces'
 
export function AdminPage({pageSession, title, children}:any) {
    useSession(pageSession)
    return (
      <Page title={"Protofy - " + title}>
        <AdminPanel workspace={Workspaces.basic}>
          {children}
        </AdminPanel>
      </Page>
    )
  }

  //<Connector brokerUrl={brokerUrl}>