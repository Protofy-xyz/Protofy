
import { YStack } from '@tamagui/stacks';
import { AlertDialog, Button, Dialog, XStack } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from '../../features/components/FilesWidget';
import { IconContainer } from '../../../components/IconContainer';
import { X } from '@tamagui/lucide-icons';
import { useUpdateEffect } from 'usehooks-ts'
import { useSearchParams } from 'solito/navigation';
import { useState } from 'react';
import { Explorer } from './Explorer';
import FileActions from '@extensions/files/fileActions';
import { getLogger, API, getPendingResult } from "protobase"
import { usePendingEffect } from '../../../lib/usePendingEffect';
import { usePrompt } from '../../../context/PromptAtom';
import "next/dynamic"

const logger = getLogger()

type RouteAdapter = {
    push: (url: string) => void
    replace: (url: string) => void
    pathname: string
    query: Record<string, string>
}

type FileBrowserProps = {
    router?: RouteAdapter        // <- opcional
    initialPath?: string 
    initialFile?: string
    initialFilesState?: any
    onOpenFile?: Function
    onChangeSelection?: Function
    selection?: Function
    fileFilter?: Function
    explorer?: any
}

export const FileBrowser = ({ router, initialPath = '/', initialFile = '', initialFilesState, onOpenFile, onChangeSelection, selection, fileFilter, explorer }: FileBrowserProps) => {
    const externalPathname = router?.pathname ?? '/files';
    const solitoEnabled = !router;
    const searchParams = solitoEnabled ? useSearchParams() : { entries: () => [] };
    const basePath = router ? externalPathname : 'files';
    const baseQuery = router ? router.query : Object.fromEntries(searchParams.entries());
    const externalPath = baseQuery.path ?? initialPath;
    const externalFile = baseQuery.file ?? initialFile;

    const [filesState, setFilesState] = useState(initialFilesState ?? getPendingResult('pending'))
    const [dialogOpen, setDialogOpen] = useState(!!externalFile);
    const [currentPath, setCurrentPath] = useState(externalPath);
    const [currentFile, setCurrentFile] = useState(externalFile);
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
    - /packages/app the custom bundle. The system encourages extension through bundles, and the custom bundle is the bundle for your specific system. You can extend the system from this bundle, or create other bundles. bundles can add apis, pages, tasks, objects and more things 
    
    Currently the user is in the directory: ${currentPath}. 
    ${currentFile ? 'The user is viewing the file' + currentFile : `The directory contents are: ${JSON.stringify(filesState)}`}
    `)

    const navigate = (url: string, replace = false) => {
        if (router) {
            replace ? router.replace(url) : router.push(url);
        } else {
            const qs = url.split('?')[1] ?? '';
            const p = new URLSearchParams(qs);
            setCurrentPath(p.get('path') ?? '/');
            setCurrentFile(p.get('file') ?? '');
        }
    };

    useUpdateEffect(() => {
        API.get({ url: '/api/core/v1/files/' + currentPath }, setFilesState);
    }, [currentPath]);

    usePendingEffect(
        (s) => { API.get({ url: '/api/core/v1/files/' + currentPath }, s); },
        setFilesState,
        initialFilesState
    );

    useUpdateEffect(() => {
        const q = new URLSearchParams({ path: currentPath });
        if (currentFile) q.set('file', currentFile);
        navigate(`${basePath}?${q.toString()}`, false);
    }, [currentPath, currentFile]);

    useUpdateEffect(() => {
        if (externalPath !== currentPath) setCurrentPath(externalPath);
        if (externalFile !== currentFile) setCurrentFile(externalFile);
    }, [externalPath, externalFile]);

    useUpdateEffect(() => {
        if (currentFile) {
            setDialogOpen(true);
        } else {
            setDialogOpen(false);
            navigate(`${basePath}?path=${currentPath}`, true);
        }
    }, [currentFile]);

    const onOpen = (file: any) => {
        if (file.isDir) return setCurrentPath(file.path ?? file.id);

        if (onOpenFile) return onOpenFile(file);

        navigate(
            `${basePath}?path=${currentPath.startsWith('/') ? currentPath : '/' + currentPath}&file=${file.name}`
        );
    };

    const { resolvedTheme } = useThemeSetting()

    const isFull = !!currentFile;

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
                customActions={[...FileActions, ...explorer?.extraActions ?? []]}
                onOpen={onOpen}
                onChangeSelection={onChangeSelection}
                selection={selection}
                fileFilter={fileFilter}
                {...explorer}
            />
            <Dialog open={dialogOpen} onOpenChange={(state) => { setDialogOpen(state); setCurrentFile('') }}>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <Dialog.Content p={0} backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'} height={'90%'} width={"90%"} >
                        {getWidget()}
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