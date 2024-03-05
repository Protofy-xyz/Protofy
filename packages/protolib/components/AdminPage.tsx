import { useSession, Page, Tinted, usePrompt, SearchContext, AdminPanel } from 'protolib'
import dynamic from 'next/dynamic';
import { forwardRef, useState } from 'react';
import { AppState } from './AdminPanel'
import { useAtom } from 'jotai';

const Chat = dynamic(() => import('protolib/components/Chat'), { ssr: false })

export const AdminPage = forwardRef(({ pageSession, title, children, integratedChat = true }: any, ref) => {
  useSession(pageSession)
  const [search, setSearch] = useState('')
  const [searchName, setSearchName] = useState('')
  const [appState] = useAtom(AppState)
  usePrompt(() => `The user is browsing an admin page in the admin panel. The title of the admin page is: "${title}"`)

  return (
    <Page ref={ref} title={"Protofy - " + title} backgroundColor={'$bgPanel'}>
      <SearchContext.Provider value={{ search, setSearch, searchName, setSearchName }}>
        <AdminPanel>
          {children}
        </AdminPanel>
      </SearchContext.Provider>
      <Tinted>
        {integratedChat && <Chat tags={['doc', title]} />}
      </Tinted>
    </Page>
  )
})

//<Connector brokerUrl={brokerUrl}>