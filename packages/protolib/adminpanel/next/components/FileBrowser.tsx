
import { YStack } from '@tamagui/stacks';
import { AlertDialog, Button, Dialog, XStack } from '@my/ui';
import { AlertDialog as ProtoAlertDialog } from '../../../components/AlertDialog';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from '../../features/components/FilesWidget';
import { IconContainer } from '../../../components/IconContainer';
import { X } from '@tamagui/lucide-icons';
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Explorer } from './Explorer';
import { defineFileAction } from 'chonky';
import FileActions from 'app/bundles/fileActions'
import {Tinted} from '../../../components/Tinted'
import Chat from '../../features/next/chat'


export const FileBrowser = ({ file, path, filesState }: any) => {
    const [dialogOpen, setDialogOpen] = useState(file ? true : false)
    const [currentPath, setCurrentPath] = useState(path)
    const [currentFile, setCurrentFile] = useState(file ? file : '')
    const currentFileName = currentFile.split('/')[currentFile.split('/').length - 1]
    const router = useRouter()
    const [openAlert, setOpenAlert] = useState(false)
    const [isModified, setIsModified] = useState(false)

    useUpdateEffect(() => {
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

    const onOpen = (file: any) => {
        console.log('on open client: ', file)
        if (file.isDir) return setCurrentPath(file.path ?? file.id)
        router.push('/admin/files' + (!currentPath.startsWith('/') ? '/' : '') + currentPath + '?file=' + file.name)
    }

    const { resolvedTheme } = useThemeSetting()

    const isFull = router.query?.full
    const getWidget = () => <FileWidget
        isFull={isFull}
        hideCloseIcon={isFull ? true : false}
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
        backgroundColor={isFull ? '$colorTransparent' : (resolvedTheme == 'dark' ? "#1e1e1e" : 'white')}
        currentFile={currentFile}
    />

    return (
        isFull ? getWidget() : <YStack overflow="hidden" f={1} backgroundColor={"$colorTransparent"} pt={4} pl={4}>
            <Explorer currentPath={currentPath} filesState={filesState} customActions={FileActions} onOpen={onOpen} />
            <Dialog open={dialogOpen} onOpenChange={(state) => { setDialogOpen(state); setCurrentFile('') }}>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content p={0} backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'} height={'90%'} width={"90%"} >
                        {getWidget()}
                        <Tinted>
                            <Chat tags={['doc', "files"]} zIndex={999999999} onScreen={dialogOpen} mode="popup" />
                        </Tinted>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>

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