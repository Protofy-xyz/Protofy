import { XStack } from 'tamagui'
import { PanelLayout } from '../../layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import { useRouter } from 'next/router';
import DBAdmin from './db';
import {getPendingResult, PendingAtomResult} from 'protolib';
import {atom, useSetAtom} from 'jotai'
import { useEffect } from 'react';

const menuData = {}
export const workspaceAtom = atom<PendingAtomResult>(getPendingResult("pending"))

export default function Admin({ workspace, data, FileBrowser }) {
    const router = useRouter()
    const parts = router.asPath.split('/')
    const section = parts.length > 2 ? parts[2].split('?')[0] : 'files' //TODO: redirect to first available path

    const setCurrentWorkspace = useSetAtom(workspaceAtom)
    useEffect(() => setCurrentWorkspace(workspace), [workspace])

    const getComponent = () => {
        switch(section) {
            case 'dbs':
                return <DBAdmin currentDbState={data?.currentDbState} contentState={data?.contentState} />
            case 'files':
                return <FileBrowser path={data?.CurrentPath} file={data?.CurrentFile} filesState={data?.filesState} />
        }
    }

    return (<PanelLayout menuContent={<PanelMenu />}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            {getComponent()}
        </XStack>
    </PanelLayout>)
}