
import { YStack } from '@tamagui/stacks';
import { AlertDialog, Button, Dialog, XStack } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from '../../features/components/FilesWidget';
import { IconContainer } from '../../../components/IconContainer';
import { X } from '@tamagui/lucide-icons';
import { useUpdateEffect } from 'usehooks-ts'
import { useSearchParams, useRouter, usePathname } from 'solito/navigation';
import { useState } from 'react';
import { Explorer } from './Explorer';
import FileActions from '../../../bundles/files/fileActions';
import { Tinted } from '../../../components/Tinted'
import Chat from '../../../components/Chat'
import { getLogger, API, getPendingResult } from "protobase"
import { usePendingEffect } from '../../../lib/usePendingEffect';
import { usePrompt } from '../../../context/PromptAtom';

const logger = getLogger()

type FileBrowserProps = {
    initialFilesState?: any
    onOpenFile?: Function
    onChangeSelection?: Function
    selection?: Function
    fileFilter?: Function
}

export const FileBrowser = ({ initialFilesState, onOpenFile, onChangeSelection, selection, fileFilter }: FileBrowserProps) => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const query = Object.fromEntries(searchParams.entries());
    const pathname = usePathname();

    const routePath = query.path ?? '/';
    const routeFile = query.file ?routePath + '/' + query.file.split('/')[0] : null

    const [filesState, setFilesState] = useState(initialFilesState ?? getPendingResult('pending'))
    const [dialogOpen, setDialogOpen] = useState(routeFile ? true : false)
    const [currentPath, setCurrentPath] = useState(routePath)
    const [currentFile, setCurrentFile] = useState(routeFile ? routeFile : '')
    const currentFileName = currentFile.split('/')[currentFile.split('/').length - 1]
    const [openAlert, setOpenAlert] = useState(false)
    const [isModified, setIsModified] = useState(false)

    usePrompt(() => currentFile ? `` : `At this moment the user is using a web file manager. The file manager allows to view and manage the files and directories of the project.
    The web file managers allow to create, view and edit files, has an integrated source code editor, an integrated visual programming editor and allows to upload and download files from the system.
    Using the file manager you have full control of the system because you can directly edit any system file. Be careful when editing sensible files, like source code or system directories, you may break the system.
    There are interesting directories:
    - /data/databases contain the databases (leveldb files)
    - /apps contain the system applications (next, expo, proxy and express apis)
    - /apps/next/public publicly accesible directory. The files you upload here can be accessed from the public system url (its the public directory of the next app)
    - /packages/app/bundles/custom the custom bundle. The system encourages extension through bundles, and the custom bundle is the bundle for your specific system. You can extend the system from this bundle, or create other bundles. bundles can add apis, pages, tasks, objects and more things 
    
    Currently the user is in the directory: ${currentPath}. 
    ${currentFile ? 'The user is viewing the file' + currentFile : `The directory contents are: ${JSON.stringify(filesState)}`}
    `)

    useUpdateEffect(() => { API.get({ url: '/adminapi/v1/files/' + currentPath }, setFilesState) }, [currentPath])
    usePendingEffect((s) => { API.get({ url: '/adminapi/v1/files/' + currentPath }, s) }, setFilesState, initialFilesState)

    useUpdateEffect(() => {
        logger.debug({ query: routePath, newpath: currentPath }, `query: ${routePath} newpath: ${currentPath}`)
        const path = (!currentPath.startsWith('/') ? '/' : '') + currentPath

        if (routePath !== currentPath) {
            const newQuery = { ...query, path: path };
            const newSearchParams = new URLSearchParams(newQuery).toString();
            const newUrl = `${pathname}?${newSearchParams}`;
            router.push(newUrl);
          }
    }, [currentPath])

    useUpdateEffect(() => {
        if (currentFile) {
            setDialogOpen(true)
        } else {
            const newQuery = { ...query };
            delete newQuery.file;
      
            const newSearchParams = new URLSearchParams(newQuery).toString();
            const newUrl = `${pathname}?${newSearchParams}`;
            router.replace(newUrl);
          }
    }, [currentFile])


    useUpdateEffect(() => {
        const path = routePath && routePath['split'] ? routePath['split']('\\').join('/') : ''
        logger.debug(`current path: ${path}`);
        if (query.file) {
            const file = (path + '/' + query.file).replace(/\/+/g, '/')
            setCurrentFile(file)
        } else {
            setCurrentFile('')
            setDialogOpen(false)
            logger.debug(`useEffect fired! ${path}`);
            setCurrentPath(path)
        }

    }, [routePath, query.file]);

    const onOpen = (file: any) => {
        logger.debug({ file }, `on open client: ${JSON.stringify(file)}`)
        if (file.isDir) return setCurrentPath(file.path ?? file.id)
        if (onOpenFile) {
            onOpenFile(file)
            return
        }
        router.push('files?path=' + (!currentPath.startsWith('/') ? '/' : '') + currentPath + '&file=' + file.name)
    }

    const { resolvedTheme } = useThemeSetting()

    const isFull = query?.file

    const getWidget = () => <FileWidget
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
            <Explorer
                currentPath={currentPath}
                filesState={filesState}
                customActions={FileActions}
                onOpen={onOpen}
                onChangeSelection={onChangeSelection}
                selection={selection}
                fileFilter={fileFilter}
            />
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