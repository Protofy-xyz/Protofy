import { AdminPanel } from '../'
import { useSession, Page, useUserSettings, useWorkspaces, Tinted } from 'protolib'
import dynamic from 'next/dynamic';
import {addResponseMessage} from 'react-chat-widget'
import { useEffect } from 'react';

const Chat = dynamic(() => import('./chat'), { ssr: false })

// console.log('widget: ', Widget)
export function AdminPage({ pageSession, title, children }: any) {
  useSession(pageSession)

  return (
    <Page title={"Protofy - " + title}>
      <Tinted>
        <Chat tags={['doc', title]} />
      </Tinted>

      <AdminPanel>
        {children}
      </AdminPanel>
    </Page>
  )
}

//<Connector brokerUrl={brokerUrl}>