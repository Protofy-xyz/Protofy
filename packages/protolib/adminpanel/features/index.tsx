import { Theme, XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import { SelectList, useWorkspaces, useUserSettings } from 'protolib'
import Workspaces from 'app/bundles/workspaces'
import { SiteConfig } from 'app/conf'
import {devMode} from '../../base/env'
import {getApiUrl} from 'protolib/base'
import { useSession } from '../../lib/Session'
import { useUpdateEffect } from 'usehooks-ts'

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

const EnvironmentSelector = ({environments}) => {
    const [settings, setSettings] = useUserSettings()
    const [session, setSession] = useSession()
    
    useUpdateEffect(() => {
        document.location.reload()
        //@ts-ignore
    }, [session.environment])
    return settings.workspace?<SelectList 
        triggerProps={{o:0.8, bc:"transparent", bw: 0}}
        valueProps={{o:0.8}}
        f={1} 
        title={"Environments"}
        value={session.environment ?? environments[0].name}
        elements={environments.map(e=>e.name)}
        setValue={(v) => {setSession({...session, environment:v})}}
    />:null
}



export const AdminPanel = ({children }) => {
    const [settings] = useUserSettings()
    const userSpaces = useWorkspaces()
    const [session, setSession] = useSession()
    
    const currentWorkspace = settings && settings.workspace? settings.workspace : userSpaces[0]
    const environments = [{
        name: devMode?'development':'production',
        address: getApiUrl()
    }, ...(SiteConfig.environments ?? [])].filter((obj, index, self) => {
        return index === self.findIndex((t) => (
            t.name === obj.name
        ));
    });
    
    // console.log('userSpaces: ', userSpaces, 'current Workspace: ', currentWorkspace)
    return (Workspaces[currentWorkspace] ? <PanelLayout topBar={<>
        <XStack $lg={{display:"none"}}>
            <XStack>{environments.length > 1 && <EnvironmentSelector environments={environments} />}</XStack>
            <XStack>{userSpaces.length > 1 && <WorkspaceSelector />}</XStack>
        </XStack>
    </>} menuContent={<PanelMenu workspace={Workspaces[currentWorkspace]} />}>
        <XStack f={1} px={"$0"} flexWrap='wrap'>
            {children}
        </XStack>
    </PanelLayout>:<></>)
}