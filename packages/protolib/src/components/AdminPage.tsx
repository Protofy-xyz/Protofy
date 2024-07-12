import { useSession, useUserSettings, useWorkspaces } from '../lib/Session';
import { Page } from './Page';
import { Tinted } from './Tinted';
import { usePrompt } from '../context/PromptAtom';
import { SearchContext } from '../context/SearchContext';
import { AdminPanel } from './AdminPanel';
import dynamic from 'next/dynamic';
import { forwardRef, useState } from 'react';
import { AppState } from './AdminPanel'
import { useAtom } from 'jotai';
import { SiteConfig } from 'app/conf'
import Workspaces from 'app/bundles/workspaces'

const Chat = dynamic(() => import('./Chat'), { ssr: false })

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
        {integratedChat && settingsAssistantEnabled && <Chat tags={['doc', title]} />}
      </Tinted>
    </Page>
  )
})

//<Connector brokerUrl={brokerUrl}>