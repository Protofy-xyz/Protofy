import { AdminPanel } from '../'
import { useSession, Page, useUserSettings, useWorkspaces, Tinted } from 'protolib'
import dynamic from 'next/dynamic';

const DynamicWidget = dynamic(() => import('react-chat-widget').then((mod) => mod.Widget), {
  ssr: false
});

// console.log('widget: ', Widget)
export function AdminPage({ pageSession, title, children }: any) {
  useSession(pageSession)
  return (
    <Page title={"Protofy - " + title}>
      <Tinted>
        <DynamicWidget
          handleNewUserMessage={() => { }}
        />
      </Tinted>

      <AdminPanel>
        {children}
      </AdminPanel>
    </Page>
  )
}

//<Connector brokerUrl={brokerUrl}>