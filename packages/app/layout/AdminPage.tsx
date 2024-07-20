import { useSession, useUserSettings, useWorkspaces } from 'protolib/dist/lib/Session';
import { Page } from 'protolib/dist/components/Page';
import { Tinted } from 'protolib/dist/components/Tinted';
import { usePrompt } from 'protolib/dist/context/PromptAtom';
import { SearchContext } from 'protolib/dist/context/SearchContext';
import { AdminPanel } from 'protolib/dist/components/AdminPanel';
import dynamic from 'next/dynamic';
import { forwardRef, useState } from 'react';
import { AppState } from 'protolib/dist/components/AdminPanel'
import { useAtom } from 'jotai';
import { SiteConfig } from 'app/conf'
import Workspaces from 'app/bundles/workspaces'

const Chat = dynamic(() => import('protolib/dist/components/Chat'), { ssr: false })

export const AdminPage = forwardRef(({ pageSession, title, children, integratedChat = true }: any, ref) => {
  useSession(pageSession)
  const [search, setSearch] = useState('')
  const [searchName, setSearchName] = useState('')
  const [appState] = useAtom(AppState)
  const projectName = SiteConfig.projectName

  const [settings] = useUserSettings()
  const userSpaces = useWorkspaces()

  const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]
  const workspaceData = typeof Workspaces[currentWorkspace] === 'function' ? Workspaces[currentWorkspace]({ pages: [] }) : Workspaces[currentWorkspace]

  const settingsAssistant = workspaceData?.assistant
  const settingsAssistantEnabled = settingsAssistant === undefined ? true : settingsAssistant

  usePrompt(() => `The user is browsing an admin page in the admin panel. The title of the admin page is: "${title}"`)

  return (
    <Page ref={ref} title={projectName + " - " + title} backgroundColor={'$bgPanel'}>
      <SearchContext.Provider value={{ search, setSearch, searchName, setSearchName }}>
        <AdminPanel>
          {children}
        </AdminPanel>
      </SearchContext.Provider>
      <Tinted>
        {/* @ts-ignore */}
        {integratedChat && settingsAssistantEnabled && <Chat tags={['doc', title]} />}
      </Tinted>
    </Page>
  )
})

export default AdminPage
//<Connector brokerUrl={brokerUrl}>