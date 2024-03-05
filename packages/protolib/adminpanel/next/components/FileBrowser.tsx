
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
import Chat from '../../../components/Chat'
import { getLogger } from "protolib/base"

const logger = getLogger()


export const FileBrowser = ({ file, path, filesState }: any) => {
    const [dialogOpen, setDialogOpen] = useState(file ? true : false)
    const [currentPath, setCurrentPath] = useState(path)
    const [currentFile, setCurrentFile] = useState(file ? file : '')
    const currentFileName = currentFile.split('/')[currentFile.split('/').length - 1]
    const router = useRouter()
    const [openAlert, setOpenAlert] = useState(false)
    const [isModified, setIsModified] = useState(false)

    useUpdateEffect(() => {
        logger.debug({ query: router.query.path, newpath: currentPath }, `query: ${router.query.path} newpath: ${currentPath}`)
        const path = (!currentPath.startsWith('/') ? '/' : '') + currentPath
        if(router.query.path != currentPath) router.push({
            pathname: router.pathname,
            query: {...router.query, path: path}
        }, undefined, { shallow: true })
    }, [currentPath])

    useUpdateEffect(() => {
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
        const path = router.query.path && router.query.path['split'] ? router.query.path['split']('\\').join('/') : ''
        logger.debug(`current path: ${path}`);
        if (router.query.file) {
            const file = (path + '/' + router.query.file).replace(/\/+/g, '/')
            setCurrentFile(file)
        } else {
            setCurrentFile('')
            setDialogOpen(false)
            logger.debug(`useEffect fired! ${path}`);
            setCurrentPath(path)
        }

    }, [router.query.path, router.query.file]);

    const onOpen = (file: any) => {
        logger.debug({ file }, `on open client: ${JSON.stringify(file)}`)
        if (file.isDir) return setCurrentPath(file.path ?? file.id)
        router.push('files?path=' + (!currentPath.startsWith('/') ? '/' : '') + currentPath + '&file=' + file.name)
    }

    const { resolvedTheme } = useThemeSetting()

    const isFull = router.query?.file
    
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
        mt={20}
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