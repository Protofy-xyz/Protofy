import { XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react';
import { workspaceAtom } from './atoms';
import { SelectList, useWorkspaces, useUserSettings } from 'protolib'

const menuData = {}

const WorkspaceSelector = () => {
    const workspaces = useWorkspaces()
    const [settings, setSettings] = useUserSettings()
    console.log(settings)
    return <SelectList f={1} title={"workspaces"} value={settings.workspace} elements={workspaces} setValue={(v) => {setSettings({...settings, workspace:v})}} />
}

export const AdminPanel = ({ workspace, children }) => {
    const setCurrentWorkspace = useSetAtom(workspaceAtom)
    useEffect(() => setCurrentWorkspace(workspace), [workspace])

    return (<PanelLayout topBar={<>
        <WorkspaceSelector />
    </>} menuContent={<PanelMenu />}>
        <XStack f={1} px={"$0"} flexWrap='wrap'>
            {children}
        </XStack>
    </PanelLayout>)
}