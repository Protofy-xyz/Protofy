import { YStack } from '@tamagui/stacks';
import Dropzone from 'react-dropzone'
import { useThemeSetting } from '@tamagui/next-theme'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, ChonkyActions } from 'chonky';
import { createApiAtom, useAtom, API } from 'protolib';
import { useState } from 'react';
import { Dialog, useTheme } from '@my/ui';
import { Uploader } from './Uploader';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const filesAtom = createApiAtom([])

export const Explorer = ({ currentPath, templateActions, onOpen, onUpload, filesState }: any) => {
    const theme = useTheme()
    const borderColor = theme.color.val.replace(/^#/, '%23')
    const [files, setFiles] = useAtom(filesAtom, filesState)
    const [showDropMessage, setShowDropMessage] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)

    const onUploadFiles = async() => {
        console.log("upload in ", currentPath)
        setFiles(await API.get('/adminapi/v1/files/'+currentPath) ?? { data: [] })
    }
    const onScroll = () => { }
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
    const { resolvedTheme } = useThemeSetting()

    const parsedFiles = files && files.data ? files.data.map((f: any) => {
        return {
            ...f,
            thumbnailUrl: (f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')) ? '/adminapi/v1/files/' + f.path : undefined
        }
    }) : []
    const folderChain = [{ id: '/', name: "Files", isDir: true }].concat(
        ...currentPath.split('/').map((x: any, i: any, arr: any) => {
            return {
                name: x,
                id: arr.slice(0, i + 1).join('/'),
                isDir: true
            };
        })
    )

    const onAddFiles = (acceptedFiles:any) => {
        console.log('files: ', acceptedFiles)
        setShowUploadDialog(true)
        setShowDropMessage(false)
    }

    return (
        <Dropzone
            onDragEnter={() => setShowUploadDialog(true)}
            noClick={true}
            onDrop={onAddFiles}
            //@ts-ignore
            onUpload={onAddFiles}
            >
            {({ getRootProps, getInputProps }) => (
                //@ts-ignore
                <YStack flex={1} {...getRootProps()} >
                    <YStack f={1}>
                        <input {...getInputProps()} />
                        <FileBrowser
                            onFileAction={(data) => {
                                if (data.id == 'open_files') {
                                    onOpen(data.payload.targetFile)
                                } else if (data.id == 'upload_files') {
                                    setShowUploadDialog(true)
                                } else {
                                    console.log('Action: ', data)
                                }
                            }}
                            disableDragAndDrop={true}
                            disableDefaultFileActions={actionsToDisable}
                            //defaultFileViewActionId={ChonkyActions.ToggleHiddenFiles.id} 
                            disableSelection={false}
                            darkMode={resolvedTheme == 'dark'}
                            files={parsedFiles}
                            folderChain={folderChain}
                            fileActions={myFileActions}
                        >
                            <FileNavbar />
                            <FileToolbar />
                            <FileList onScroll={onScroll} />
                            {/* <FileContextMenu/> */}
                        </FileBrowser>

                        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                            <Dialog.Portal>
                                <Dialog.Overlay />
                                <Dialog.Content p={0} backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'} height={'600px'} width={"600px"} >
                                    <Uploader path={currentPath} onUpload={onUploadFiles}/>
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
                    </YStack>
                </YStack>
            )}
        </Dropzone>
    )
}