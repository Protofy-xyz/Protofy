import { YStack, XStack } from 'tamagui'
import { IconContainer, createApiAtom, useHydratedAtom } from 'protolib'
import { PanelLayout } from '../../layout/PanelLayout'
import { X } from '@tamagui/lucide-icons'
import { atom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { AlertDialog, Button, Dialog } from '@my/ui'
import { useEffect, useState } from 'react'

import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from './components/FilesWidget'
import { PanelMenu } from './components/PanelMenu'

const [filesArr, filesAtom] = createApiAtom([])

const data = {
    "Files": [
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "data", "href": "/admin/files/data" },
        { "name": "packages", "href": "/admin/files/packages" }
    ],
    "Files 2": [
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "apps", "href": "/admin/files/apps" }
    ],
}


export default function Admin({ pageSession, filesState, FileBrowser, CurrentPath, CurrentFile }) {
    const { resolvedTheme } = useThemeSetting()
    const [dialogOpen, setDialogOpen] = useState(CurrentFile ? true : false)
    const router = useRouter()

    
    const [files, setFiles] = useHydratedAtom(filesArr, filesState, filesAtom)
    const [currentPath, setCurrentPath] = useState(CurrentPath)
    const [currentFile, setCurrentFile] = useState(CurrentFile ? CurrentFile : '')
    const [isModified, setIsModified] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)

    const currentFileName = currentFile.split('/')[currentFile.split('/').length - 1]
    useUpdateEffect(() => {
        console.log('current Path: ', currentPath)
        //API.get('/adminapi/v1/files/'+currentPath, setFiles)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath)
    }, [currentPath])

    useUpdateEffect(() => {
        console.log('router q: ', router.query.file)
        const r = router.asPath.split('?')[0].substring('/admin/files'.length)
        if (router.query.file) {
            const file = (r + '/' + router.query.file).replace(/\/+/g, '/')
            setCurrentFile(file)
        } else {
            setCurrentFile('')
            setDialogOpen(false)
            console.log('useEffect fired!', r);
            setCurrentPath(r)
        }

    }, [router.asPath]);


    useEffect(() => {
        if (currentFile) {
            setDialogOpen(true)
        } else {
            const newQuery = { ...router.query };
            delete newQuery.file;
            router.replace({
                pathname: router.pathname,
                query: newQuery
            }, undefined, { shallow: true });
        }
    }, [currentFile])

    const onOpen = (file) => {
        console.log('on open client: ', file)
        if (file.isDir) return setCurrentPath(file.path ?? file.id)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath + '?file=' + file.name)
    }

    return (<PanelLayout menuContent={<PanelMenu menu={data}/>}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            <FileBrowser currentFile={currentFile} currentFileName={currentFileName} dialogOpen={dialogOpen} setOpenAlert={setOpenAlert} setIsModified={setIsModified} openAlert={openAlert} setDialogOpen={setDialogOpen} setCurrentFile={setCurrentFile} isModified={isModified} folderChain={[{ id: '/', name: "Files", isDir: true }].concat(
                ...currentPath.split('/').map((x, i, arr) => {
                    return {
                        name: x,
                        id: arr.slice(0, i + 1).join('/'),
                        isDir: true
                    };
                })
            )} onOpen={onOpen} files={files.data.map(f => {
                return {
                    ...f,
                    thumbnailUrl: (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')) ? '/adminapi/v1/files/' + f.path : undefined
                }
            })} />
        </XStack>
    </PanelLayout>)
}