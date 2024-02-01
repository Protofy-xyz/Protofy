import { useSession, Page, useUserSettings, useWorkspaces, Tinted, Search, usePrompt, SearchContext, AdminPanel, MainPanel } from 'protolib'
import dynamic from 'next/dynamic';
import { addResponseMessage } from 'react-chat-widget'
import { useEffect, useState } from 'react';
import {AppState} from './AdminPanel'
import { useAtom} from 'jotai';

const Chat = dynamic(() => import('protolib/components/Chat'), { ssr: false })

// console.log('widget: ', Widget)
export function AdminPage({ pageSession, title, children }: any) {
  useSession(pageSession)
  const [search, setSearch] = useState('')
  const [searchName, setSearchName] = useState('')
  const [appState] = useAtom(AppState)
  usePrompt(() => `The user is browsing an admin page in the admin panel. The title of the admin page is: "${title}"`)

  return (
    <Page title={"Protofy - " + title}>
      <SearchContext.Provider value={{ search, setSearch, searchName, setSearchName }}>
        <AdminPanel>
          {children}
        </AdminPanel>
      </SearchContext.Provider>
      <Tinted>
        <Chat tags={['doc', title]} />
      </Tinted>
    </Page>
  )
}

//<Connector brokerUrl={brokerUrl}>