import { useSession, useUserSettings, useWorkspaces } from '../lib/useSession';
import { Page } from './Page';
import { Tinted } from './Tinted';
import { usePrompt } from '../context/PromptAtom';
import { SearchContext } from '../context/SearchContext';
import { AdminPanel } from './AdminPanel';
import { forwardRef, useState, useContext, useEffect } from 'react';
import { AppConfContext, SiteConfigType } from "../providers/AppConf"
import { BubbleChat } from './BubbleChat';
import { useRouter } from 'next/router'
import { useIsAdmin } from '../lib/useIsAdmin';

export const AdminPage = forwardRef(({ pageSession, title, children, integratedChat = true }: any, ref) => {
  useSession(pageSession)

  useIsAdmin(() => '/auth/login?return='+document?.location?.pathname+'?'+document?.location?.search)
  const router = useRouter()

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) setReady(true);
  }, [router.isReady]);

  const [search, setSearch] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchStatus, setSearchStatus] = useState<any>()
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

  if(!ready) {
    return <></>
  } 

  if(router.query.mode === 'embed') {
    return children
  }

  return (
    <Tinted>
      <Page ref={ref} title={title + " - " +projectName} backgroundColor={'$bgContent'}>
        <SearchContext.Provider value={{ search, setSearch, searchName, setSearchName, searchStatus, setSearchStatus }}>
          <AdminPanel>
            {children}
          </AdminPanel>
        </SearchContext.Provider>
        <Tinted>
          {integratedChat && settingsAssistantEnabled && <BubbleChat apiUrl="/api/v1/chatbots/board"/>}
        </Tinted>
      </Page>
    </Tinted>
  )
})

//<Connector brokerUrl={brokerUrl}>