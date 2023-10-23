import { YStack } from '@tamagui/stacks';
import Dropzone from 'react-dropzone'
import { useThemeSetting } from '@tamagui/next-theme'
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, ChonkyActions } from 'chonky';
import { Tinted, AlertDialog, createApiAtom, useAtom, API } from 'protolib';
import { useState } from 'react';
import { Dialog, Paragraph, useTheme, Text, SizableText, Stack, XStack } from '@my/ui';
import { Uploader } from './Uploader';
import {Download} from '@tamagui/lucide-icons'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const filesAtom = createApiAtom([])

export const Explorer = ({ currentPath, templateActions, onOpen, onUpload, filesState }: any) => {
    const theme = useTheme()
    const borderColor = theme.color.val.replace(/^#/, '%23')
    const [files, setFiles] = useAtom(filesAtom, filesState)
    const [showDropMessage, setShowDropMessage] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])

    const onUploadFiles = async () => {
        setFiles(await API.get('/adminapi/v1/files/' + currentPath) ?? { data: [] })
    }
    const onScroll = () => { }
    const myFileActions = [
        ...templateActions,
        ChonkyActions.UploadFiles,
        // ChonkyActions.EnableCompactView
        // ChonkyActions.CreateFolder
        ChonkyActions.DownloadFiles,
        ChonkyActions.DeleteFiles
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

    const onAddFiles = (acceptedFiles: any) => {
        console.log('files: ', acceptedFiles)
        setShowUploadDialog(true)
        setShowDropMessage(false)
    }

    const onDeleteFiles = (data: any) => {
        const filesToDelete = data.state.selectedFilesForAction.map(f => f.name)
        setSelectedFiles(filesToDelete)
        setOpenDeleteDialog(true)
    }

    const onDownloadFiles = (data: any) => {
        const filesToDownload = data.state.selectedFilesForAction.filter(f => !f.isDir).map(f => f.name)
        if(!filesToDownload.length) return
        if(filesToDownload.length == 1) {
            window.open("/adminapi/v1/files/"+currentPath+'/'+filesToDownload[0]+'?download=1', '_new')
        } else {
            setSelectedFiles(filesToDownload)
            setOpenDownloadDialog(true)
        }
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
                    <AlertDialog
                        p="$5"
                        acceptCaption="Close"
                        setOpen={setOpenDownloadDialog}
                        open={openDownloadDialog}
                        hideAccept={true}
                        title={<Tinted><Text color="$color7">Download</Text></Tinted>}
                        description="Use those links to download:"
                    >
                        <YStack f={1}>
                            {selectedFiles.map(f => <a href={"/adminapi/v1/files/"+currentPath+'/'+f+'?download=1'} target="_new">
                                <XStack mb="$2" br="$radius.12" p="$2" px="$4" backgroundColor={"$color4"} hoverStyle={{backgroundColor:"$color6", o: 1}} o={0.7} ai="center" jc="center">
                                    <Download />
                                    <SizableText ml="$2">{f}</SizableText>
                                </XStack>
                            </a>)}
                        </YStack>
                    </AlertDialog>
                    <AlertDialog
                        acceptButtonProps={{color:"white",backgroundColor:"$red9"}}
                        p="$5"
                        acceptCaption="Delete"
                        setOpen={setOpenDeleteDialog}
                        open={openDeleteDialog}
                        onAccept={async (seter) => {
                            await API.post('/adminapi/v1/deleteFiles/'+currentPath, selectedFiles)
                            setFiles(await API.get('/adminapi/v1/files/' + currentPath) ?? { data: [] })
                        }}
                        acceptTint="red"
                        title={<Text color="$red9">Delete{(selectedFiles.length > 1?' '+selectedFiles.length+' files?': '?')}</Text>}
                        description={"The following files will be deleted:"}
                    >
                        <YStack f={1}>
                            {selectedFiles.map(f => <Paragraph>{f}</Paragraph>)}
                        </YStack>
                    </AlertDialog>

                    <YStack f={1}>
                        <input {...getInputProps()} />
                        <Tinted>
                            <FileBrowser
                                onFileAction={(data) => {
                                    if (data.id == 'open_files') {
                                        onOpen(data.payload.targetFile)
                                    } else if (data.id == 'upload_files') {
                                        setShowUploadDialog(true)
                                    } else if (data.id == 'delete_files') {
                                        onDeleteFiles(data)
                                    } else if(data.id == 'download_files') {
                                        onDownloadFiles(data)
                                    } else {
                                        //console.log('Action: ', data)
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
                        </Tinted>


                        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                            <Dialog.Portal>
                                <Dialog.Overlay />
                                <Dialog.Content p={0} backgroundColor={resolvedTheme == 'dark' ? "#1e1e1e" : 'white'} height={'600px'} width={"600px"} >
                                    <Uploader path={currentPath} onUpload={onUploadFiles} setShowUploadDialog={setShowUploadDialog} />
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