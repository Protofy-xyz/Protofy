import { XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { SelectList, useWorkspaces, useUserSettings, useSession, PanelMenu, MainPanel} from 'protolib'
import Workspaces from 'app/bundles/workspaces'
import { InteractiveIcon } from './InteractiveIcon'
import { Activity } from '@tamagui/lucide-icons'
import { Tinted } from './Tinted'
import { atom, useAtom} from 'jotai';
const menuData = {}

const WorkspaceSelector = () => {
    const workspaces = useWorkspaces()
    const [settings, setSettings] = useUserSettings()

    return settings.workspace?<SelectList 
        triggerProps={{o:0.8, bc:"transparent", bw: 0}}
        valueProps={{o:0.8}}
        f={1} 
        title={"workspaces"}
        value={settings.workspace}
        elements={workspaces}
        setValue={(v) => {setSettings({...settings, workspace:v})}}
    />:null
}

export const AppState = atom({
  logsPanelOpened: false
})

export const AdminPanel = ({children }) => {
    const [settings] = useUserSettings()
    const userSpaces = useWorkspaces()
    const [session, setSession] = useSession()
    const [appState, setAppState] = useAtom(AppState)
    const currentWorkspace = settings && settings.workspace? settings.workspace : userSpaces[0]
    
    // console.log('userSpaces: ', userSpaces, 'current Workspace: ', currentWorkspace)
    return <MainPanel rightPanelVisible={appState.logsPanelOpened} rightPanelResizable={true} centerPanelContent={Workspaces[currentWorkspace] 
        ? <PanelLayout 
            topBar={
              <>
                  <XStack ai="center">
                    <XStack>{userSpaces.length > 1 && <WorkspaceSelector />}</XStack>
                    {/* <InteractiveIcon onPress={() => setAppState({...appState, logsPanelOpened: !appState.logsPanelOpened})} IconColor="var(--color)" Icon={Activity}></InteractiveIcon> */}
                  </XStack>
              </>
            } 
            menuContent={<PanelMenu workspace={Workspaces[currentWorkspace]} />}
          >
            <XStack f={1} px={"$0"} flexWrap='wrap'>
              {children}
            </XStack>
          </PanelLayout>
        : <></>
          } />
}