import { XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import { SelectList, useWorkspaces, useUserSettings } from 'protolib'
import Workspaces from 'app/bundles/workspaces'

const menuData = {}

const WorkspaceSelector = () => {
    const workspaces = useWorkspaces()
    const [settings, setSettings] = useUserSettings()
    // console.log(settings)
    return <SelectList f={1} title={"workspaces"} value={settings.workspace} elements={workspaces} setValue={(v) => {setSettings({...settings, workspace:v})}} />
}

export const AdminPanel = ({children }) => {
    const [settings, setSettings] = useUserSettings()
    const userSpaces = useWorkspaces()
    const currentWorkspace = settings && settings.workspace? settings.workspace : userSpaces[0]
    
    // console.log('userSpaces: ', userSpaces, 'current Workspace: ', currentWorkspace)
    return (Workspaces[currentWorkspace] ? <PanelLayout topBar={<>
        <WorkspaceSelector />
    </>} menuContent={<PanelMenu workspace={Workspaces[currentWorkspace]} />}>
        <XStack f={1} px={"$0"} flexWrap='wrap'>
            {children}
        </XStack>
    </PanelLayout>:<></>)
}