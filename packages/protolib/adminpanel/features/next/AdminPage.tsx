import { AdminPanel } from '../'
import { useSession, Page, useUserSettings, useWorkspaces, Tinted, Search } from 'protolib'
import dynamic from 'next/dynamic';
import {addResponseMessage} from 'react-chat-widget'
import { useEffect, useState } from 'react';
import {SearchContext} from '../../../context/SearchContext'

const Chat = dynamic(() => import('./chat'), { ssr: false })

// console.log('widget: ', Widget)
export function AdminPage({ pageSession, title, children }: any) {
  useSession(pageSession)
  const [search, setSearch] = useState('')
  const [searchName, setSearchName] = useState('')

  return (
    <Page title={"Protofy - " + title}>
      <Tinted>
        <Chat tags={['doc', title]} />
      </Tinted>
      
      <SearchContext.Provider value={{ search, setSearch, searchName, setSearchName}}>
        <AdminPanel>
          {children}
        </AdminPanel>
      </SearchContext.Provider>
    </Page>
  )
}

//<Connector brokerUrl={brokerUrl}>