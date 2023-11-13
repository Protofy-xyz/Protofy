import { AdminPanel } from '../'

import { useSession, Page, useUserSettings, useWorkspaces } from 'protolib'
import Workspaces from 'app/bundles/workspaces'

export function AdminPage({ pageSession, title, children }: any) {
  useSession(pageSession)
  const [settings, setSettings] = useUserSettings()
  const userSpaces = useWorkspaces()
  const currentWorkspace = settings && settings.workspace? settings.workspace : userSpaces[0]


  return (
    <Page title={"Protofy - " + title}>
      <AdminPanel workspace={Workspaces[currentWorkspace]??{}}>
        {children}
      </AdminPanel>
    </Page>
  )
}

//<Connector brokerUrl={brokerUrl}>