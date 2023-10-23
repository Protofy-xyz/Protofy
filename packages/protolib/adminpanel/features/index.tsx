import { XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import {useSetAtom} from 'jotai'
import { useEffect } from 'react';
import { workspaceAtom } from './atoms';

const menuData = {}

export const AdminPanel = ({ workspace, children}) => {
    const setCurrentWorkspace = useSetAtom(workspaceAtom)
    useEffect(() => setCurrentWorkspace(workspace), [workspace])

    return (<PanelLayout menuContent={<PanelMenu />}>
        <XStack f={1} px={"$0"} flexWrap='wrap'>
            {children}
        </XStack>
    </PanelLayout>)
}