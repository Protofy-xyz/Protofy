import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions} from 'chonky';
import { YStack } from '@tamagui/stacks';
import { AlertDialog, Button, XStack, useTheme } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const WebFileBrowser = ({setIsModified, openAlert, setOpenAlert, setDialogOpen, setCurrentFile, isModified,folderChain=[{ id: 'xcv', name: 'Files', isDir: true }],files=[], onOpen=(path:string) => {}}:any) => {

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