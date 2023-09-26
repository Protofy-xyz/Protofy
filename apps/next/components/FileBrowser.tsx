import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions} from 'chonky';
import { YStack } from '@tamagui/stacks';
import { AlertDialog, Button, Dialog, XStack, useTheme } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'
import { FileWidget } from 'app/features/admin/components/FilesWidget';
import { IconContainer } from 'protolib';
import { X } from '@tamagui/lucide-icons';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const WebFileBrowser = ({currentFile, currentFileName, dialogOpen, setIsModified, openAlert, setOpenAlert, setDialogOpen, setCurrentFile, isModified,folderChain=[{ id: 'xcv', name: 'Files', isDir: true }],files=[], onOpen=(path:string) => {}}:any) => {

    const {resolvedTheme} = useThemeSetting()
    const theme = useTheme()

    const onScroll=() => {}

    const myFileActions = [
        ChonkyActions.UploadFiles,
        ChonkyActions.DownloadFiles,
        ChonkyActions.DeleteFiles,
    ];

    const actionsToDisable: string[] = [
        ChonkyActions.SelectAllFiles.id,
    ];
    return (
        <YStack overflow="hidden" f={1} backgroundColor={"$colorTransparent"} pt={4} pl={4}>
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
                files={files} 
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
        </YStack>
    );
};

export default WebFileBrowser