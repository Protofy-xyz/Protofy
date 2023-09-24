import { YStack, XStack, Stack, Input, Theme, Paragraph, Text } from 'tamagui'
import { API, withSession, createApiAtom, usePendingEffect, PanelMenuItem, redirect, useHydratedAtom, DataCard, ItemCard, BigTitle, Search } from 'protolib'
import { PanelLayout } from '../../layout/PanelLayout'
import { Cross, Database, Key, Plus, PlusCircle } from '@tamagui/lucide-icons'
import { atom, useAtom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { Link } from '@my/ui'
import { useState } from 'react'
import { useTint } from '@tamagui/logo'
import { FullFileBrowser } from 'chonky';
import dynamic from 'next/dynamic'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';

// import FileBrowser from '../../../components/FileBrowser'

// Somewhere in your `index.ts`:
setChonkyDefaults({ iconComponent: ChonkyIconFA });

const [filesArr, filesAtom] = createApiAtom([])
const currentDbAtom = atom(0)

const Menu = () => {
    return (<YStack pt="$10">

        <Link
            href={"/admin/files/"}
            onPressApp={() => {}}
        >
            <PanelMenuItem
                selected={true}
                icon={<Database color="$color11" strokeWidth={1.5} />}
                text={'Files'}
            />
        </Link>

    </YStack>)
}

export default function Admin({ pageSession, filesState, FileBrowser, CurrentPath}) {
    const router = useRouter()
    const [files, setFiles] = useHydratedAtom(filesArr, filesState, filesAtom)
    const [currentPath, setCurrentPath] = useState(CurrentPath)
    
    useUpdateEffect(() => {
        console.log('current Path: ', currentPath)
        //API.get('/adminapi/v1/files/'+currentPath, setFiles)
        router.push('/admin/files'+(!currentPath.startsWith('/')?'/':'')+currentPath)
    }, [currentPath])

    useUpdateEffect(() => {
        const r = router.asPath.substring('/admin/files'.length)
        console.log('useEffect fired!', r);
        setCurrentPath(r)
    }, [router.asPath]);
 
    return (<PanelLayout menuContent={<Menu />}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            <FileBrowser folderChain={[{id: '/', name: "Files", isDir: true}].concat(
                ...currentPath.split('/').map((x, i, arr) => {
                    return {
                        name: x,
                        id: arr.slice(0, i + 1).join('/'),
                        isDir: true
                    };
                })
            )} onOpen={(path) => setCurrentPath(path)} files={files.data.map(f => {
                return {
                    ...f,
                    thumbnailUrl: (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')) ? '/adminapi/v1/files/'+f.path : undefined
                }
            })} />
        </XStack>
    </PanelLayout>)
}