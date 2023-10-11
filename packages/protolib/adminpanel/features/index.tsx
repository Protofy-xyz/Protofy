import { XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import {getPendingResult, PendingAtomResult} from 'protolib';
import {atom, useSetAtom} from 'jotai'
import { useEffect } from 'react';

const menuData = {}
export const workspaceAtom = atom<PendingAtomResult>(getPendingResult("pending"))

export const AdminPanel = ({ workspace, children}) => {
    const setCurrentWorkspace = useSetAtom(workspaceAtom)
    useEffect(() => setCurrentWorkspace(workspace), [workspace])

    return (<PanelLayout menuContent={<PanelMenu />}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            {children}
        </XStack>
    </PanelLayout>)
}