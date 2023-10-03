import { YStack } from '@tamagui/stacks';
import Dropzone from 'react-dropzone'
import { useThemeSetting } from '@tamagui/next-theme'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions, defineFileAction } from 'chonky';
import { BigTitle, createApiAtom, useAtom } from 'protolib';
import { useState } from 'react';
import { UploadCloud } from '@tamagui/lucide-icons'
import { H2, H4, Text, useTheme } from '@my/ui';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const filesAtom = createApiAtom([])

export const Explorer = ({ currentPath, templateActions, onOpen, onUpload, filesState }: any) => {
    const theme = useTheme()
    console.log('theeeeeeme: ', theme.borderColor.val)
    const borderColor = theme.color.val.replace(/^#/, '%23')
    const [files, setFiles] = useAtom(filesAtom, filesState)
    const [showDropMessage, setShowDropMessage] = useState(false)
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
        <Dropzone

            onDragEnter={() => setShowDropMessage(true)}
            onDragLeave={() => setShowDropMessage(false)}
            noClick={false}
            onDrop={(acceptedFiles: any) => console.log("uploaded: ", acceptedFiles)
            }>
            {({ getRootProps, getInputProps }) => (
                //@ts-ignore
                <YStack flex={1} {...getRootProps()} >
                    <YStack f={1} onPress={(e) => {
                        let current:any = e.target;
                        let found = false
                        while(current && !found){
                            if(current.type == 'button' && current.title == 'Upload files') {
                                found = true
                            } else {
                                current = current.parentNode
                            }
                        }

                        if(!found) {
                            e.stopPropagation()
                        }
                    }}>
                        <input {...getInputProps()} />
                        <FileBrowser
                            onFileAction={(data) => {
                                if (data.id == 'open_files') {
                                    onOpen(data.payload.targetFile)
                                } else if (data.id == 'upload_files') {
                                    setShowDropMessage(false)
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
                        {showDropMessage ? <>
                            <YStack
                                position="absolute"
                                backgroundColor={"$background"}
                                o={0.8}
                                width="100%"
                                f={1}
                                height={"100%"}
                                jc="center"
                                ai="center"
                            >
                                <YStack
                                    onPress={(e) => e.stopPropagation()}
                                    // borderStyle='dashed'
                                    // borderRadius={10}
                                    // borderWidth={3}
                                    position="absolute"
                                    backgroundColor={"$background"}
                                    o={0.7}
                                    width="100%"
                                    f={1}
                                    top={10}
                                    height={"calc(100% - 30px)"}
                                    jc="center"
                                    ai="center"
                                >
                                    <UploadCloud size="$7" />
                                    <H2 mt="$5">Drop files to upload</H2>
                                </YStack>
                            </YStack></> : null}
                    </YStack>
                </YStack>
            )}
        </Dropzone>
    )
}