import { YStack } from '@tamagui/stacks';
import Dropzone from 'react-dropzone'
import { useThemeSetting } from '@tamagui/next-theme'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions, defineFileAction } from 'chonky';
import { createApiAtom, useAtom } from 'protolib';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const filesAtom = createApiAtom([])

export const Explorer = ({currentPath, templateActions, onOpen, onUpload, filesState}:any) => {
    const [files, setFiles] = useAtom(filesAtom, filesState)
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
    
    return (
        <Dropzone noClick={true} onDrop={(acceptedFiles:any) => console.log("uploaded: ", acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    //@ts-ignore
                    <YStack flex={1} {...getRootProps()} >
                        <input {...getInputProps()} />
                        <FileBrowser
                            onFileAction={(data) => {
                                if (data.id == 'open_files') {
                                    onOpen(data.payload.targetFile)
                                } else if (data.id == 'upload_files') {
                                    onUpload()
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
                    </YStack>
                )}
            </Dropzone>
    )
}