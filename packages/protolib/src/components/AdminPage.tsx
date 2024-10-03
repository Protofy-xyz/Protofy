import { useSession, useUserSettings, useWorkspaces } from '../lib/Session';
import { Page } from './Page';
import { Tinted } from './Tinted';
import { usePrompt } from '../context/PromptAtom';
import { SearchContext } from '../context/SearchContext';
import { AdminPanel } from './AdminPanel';
import { forwardRef, useState, useContext } from 'react';
import { AppConfContext, SiteConfigType } from "../providers/AppConf"
import { ChatWidget } from './ChatWidget';

export const AdminPage = forwardRef(({ pageSession, title, children, integratedChat = true }: any, ref) => {
  useSession(pageSession)
  const [search, setSearch] = useState('')
  const [searchName, setSearchName] = useState('')
  const SiteConfig = useContext<SiteConfigType>(AppConfContext);
  const { workspaces } = SiteConfig.bundles
  const projectName = SiteConfig.projectName

  const [settings] = useUserSettings()
  const userSpaces = useWorkspaces()

  const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]
  const workspaceData = typeof workspaces[currentWorkspace] === 'function' ? workspaces[currentWorkspace]({ pages: [] }) : workspaces[currentWorkspace]

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
        {integratedChat && settingsAssistantEnabled && <ChatWidget/>}
      </Tinted>
    </Page>
  )
})

//<Connector brokerUrl={brokerUrl}>