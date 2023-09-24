import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions} from 'chonky';
import { YStack } from '@tamagui/stacks';
import { useTheme } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const WebFileBrowser = ({folderChain=[{ id: 'xcv', name: 'Files', isDir: true }],files=[], onOpen=(path:string) => {}}) => {

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
                //defaultFileViewActionId={ChonkyActions.EnableListView.id} 
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
        </YStack>
    );
};

export default WebFileBrowser