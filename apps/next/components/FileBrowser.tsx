import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions, defineFileAction} from 'chonky';
import { YStack } from '@tamagui/stacks';
import { AlertDialog, Button, Dialog, XStack, useTheme } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from 'app/features/admin/components/FilesWidget';
import { useAtom, IconContainer, createApiAtom } from 'protolib';
import { X } from '@tamagui/lucide-icons';
import {useUpdateEffect} from 'usehooks-ts'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { workspaceAtom} from 'app/features/admin'
import { WorkspaceModel } from 'common';
setChonkyDefaults({ iconComponent: ChonkyIconFA });
const filesAtom = createApiAtom([])

const WebFileBrowser = ({file, path, filesState}:any) => {
    const [files, setFiles] = useAtom(filesAtom, filesState)
    const [dialogOpen, setDialogOpen] = useState(file ? true : false)
    const [currentPath, setCurrentPath] = useState(path)
    const [currentFile, setCurrentFile] = useState(file ? file : '')
    const currentFileName = currentFile.split('/')[currentFile.split('/').length - 1]
    const router = useRouter()
    const [openAlert, setOpenAlert] = useState(false)
    const [isModified, setIsModified] = useState(false)
    const [workspace] = useAtom(workspaceAtom)

    useUpdateEffect(() => {
        console.log('current Path: ', currentPath)
        //API.get('/adminapi/v1/files/'+currentPath, setFiles)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath)
    }, [currentPath])

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

    
    useUpdateEffect(() => {
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

    const onOpen = (file:any) => {
        console.log('on open client: ', file)
        if (file.isDir) return setCurrentPath(file.path ?? file.id)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath + '?file=' + file.name)
    }
    
    const parsedFiles = files && files.data ? files.data.map((f:any) => {
        return {
            ...f,
            thumbnailUrl: (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')) ? '/adminapi/v1/files/' + f.path : undefined
        }
    }):[]
    const folderChain = [{ id: '/', name: "Files", isDir: true }].concat(
        ...currentPath.split('/').map((x:any, i:any, arr:any) => {
            return {
                name: x,
                id: arr.slice(0, i + 1).join('/'),
                isDir: true
            };
        })
    )
    const {resolvedTheme} = useThemeSetting()
    const theme = useTheme()

    const onScroll=() => {}

    var templateActions:any = []
    if(workspace.isLoaded) {
        WorkspaceModel.load(workspace.data)
            .getResources()
            .byType('template')
            .byPath(currentPath)
            .forEach((resource) => {
                resource.getOption('templates').forEach((template:any) => {
                    templateActions.push(defineFileAction({
                        id: 'template_'+template.name,
                        button: {
                            name: template.title,
                            toolbar: true,
                            group: 'Templates'
                        }
                    }))
                })
            })
    }

    console.log('tppppppl', templateActions)



    const myFileActions = [
        ...templateActions,
        ChonkyActions.UploadFiles,
        // ChonkyActions.DownloadFiles,
        // ChonkyActions.DeleteFiles,
    ];

    

    const actionsToDisable: string[] = [
        ChonkyActions.SelectAllFiles.id,
        ChonkyActions.ClearSelection.id,
        ChonkyActions.OpenSelection.id
    ];

    const isFull = router.query?.full
    const getWidget = () => <FileWidget
        isFull={isFull}
        hideCloseIcon={isFull?true:false}
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
        backgroundColor={isFull? '$colorTransparent':(resolvedTheme == 'dark' ? "#1e1e1e" : 'white')}
        currentFile={currentFile}
    />

    return (
        isFull?getWidget(): <YStack overflow="hidden" f={1} backgroundColor={"$colorTransparent"} pt={4} pl={4}>
            <FileBrowser
                onFileAction={(data) => {
                    if(data.id == 'open_files') {
                        onOpen(data.payload.targetFile)
                    } else {
                        console.log('Action: ', data)
                    }
                }}
                disableDragAndDrop={true}
                disableDefaultFileActions={actionsToDisable}
                //defaultFileViewActionId={ChonkyActions.ToggleHiddenFiles.id} 
                disableSelection={false} 
                darkMode={resolvedTheme=='dark'} 
                files={parsedFiles} 
                folderChain={folderChain}
                fileActions={myFileActions}
            >
                <FileNavbar />
                <FileToolbar />
                <FileList onScroll={onScroll}/>
                {/* <FileContextMenu/> */}
            </FileBrowser>
            <Dialog open={dialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content p={0} backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'} height={'90%'} width={"90%"} >
                        {getWidget()}

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
        </YStack>
    );
};

export default WebFileBrowser