import { AdminPanel } from '../'

import { useSession, Page, useUserSettings, useWorkspaces } from 'protolib'

export function AdminPage({ pageSession, title, children }: any) {
  useSession(pageSession)
  return (
    <Page title={"Protofy - " + title}>
      <AdminPanel>
        {children}
      </AdminPanel>
    </Page>
  )
}

//<Connector brokerUrl={brokerUrl}>