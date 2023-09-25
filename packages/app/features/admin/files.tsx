import { YStack, XStack } from 'tamagui'
import { IconContainer, createApiAtom, useHydratedAtom } from 'protolib'
import { PanelLayout } from '../../layout/PanelLayout'
import { X } from '@tamagui/lucide-icons'
import { atom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { AlertDialog, Button, Dialog } from '@my/ui'
import { useEffect, useState } from 'react'
import { ChonkyActions } from 'chonky';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from './components/FilesWidget'
import { PanelMenu } from './components/PanelMenu'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
ChonkyActions.ToggleHiddenFiles.option.defaultValue = false;
const [filesArr, filesAtom] = createApiAtom([])
const currentDbAtom = atom(0)

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
            <FileBrowser folderChain={[{ id: '/', name: "Files", isDir: true }].concat(
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
            <Dialog open={dialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content p={0} backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'} height={'90%'} width={"90%"} >
                        <FileWidget
                            isModified={isModified}
                            setIsModified={setIsModified}
                            icons={[
                                <IconContainer onPress={() => {
                                    if (isModified) return setOpenAlert(true)
                                    setCurrentFile('');
                                    setDialogOpen(false)
                                }}>
                                    <X color="var(--color)" size={"$1"} />
                                </IconContainer>
                            ]}
                            currentFileName={currentFileName}
                            backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'}
                            currentFile={currentFile}
                        />

                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>

                {/* optionally change to sheet when small screen */}
                <Dialog.Adapt when="sm">
                    <Dialog.Sheet>
                        <Dialog.Sheet.Frame>
                            <Dialog.Adapt.Contents />
                        </Dialog.Sheet.Frame>
                        <Dialog.Sheet.Overlay />
                    </Dialog.Sheet>
                </Dialog.Adapt>
            </Dialog>

            <AlertDialog open={openAlert} onOpenChange={setOpenAlert} native>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        key="overlay"
                        opacity={0.5}
                    />
                    <AlertDialog.Content
                        bordered
                        elevate
                        key="content"
                        x={0}
                        scale={1}
                        opacity={1}
                        y={0}
                    >
                        <YStack space>
                            <AlertDialog.Description>
                                The current file contains unsaved changes. Are you sure you want to close it without saving?
                            </AlertDialog.Description>

                            <XStack space="$3" justifyContent="flex-end">
                                <AlertDialog.Cancel asChild>
                                    <Button>Cancel</Button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                    <Button onPress={() => {
                                        setIsModified(false)
                                        setCurrentFile('');
                                        setDialogOpen(false)
                                        setOpenAlert(false)
                                    }} theme="active">Close file</Button>
                                </AlertDialog.Action>
                            </XStack>
                        </YStack>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog>
        </XStack>
    </PanelLayout>)
}