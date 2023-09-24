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

export default function Admin({ pageSession, filesState, FileBrowser}) {
    const router = useRouter()
    const [files, setFiles] = useHydratedAtom(filesArr, filesState, filesAtom)

    const _setFiles = (files) => {
        if(!files) setFiles([])
        setFiles(files.map(f => {
            return {
                ...f,
                color: '#ff0000'
            }
        }))
    }
    usePendingEffect(() => API.get('/adminapi/v1/files', setFiles), files)
 
    return (<PanelLayout menuContent={<Menu />}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            <FileBrowser onOpen={(path) => {
                API.get('/adminapi/v1/files/'+path, setFiles)
            }} files={files.data} />
        </XStack>
    </PanelLayout>)
}