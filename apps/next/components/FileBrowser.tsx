import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu, ChonkyActions} from 'chonky';
import { YStack } from '@tamagui/stacks';
import { useTheme } from '@my/ui';
import { useThemeSetting } from '@tamagui/next-theme'

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const WebFileBrowser = () => {

    const {resolvedTheme} = useThemeSetting()
    const files = [
        { id: 'lht', name: 'Projects', isDir: true },
        {
            id: 'mcd',
            name: 'chonky-sphere-v2.png',
            thumbnailUrl: 'https://chonky.io/chonky-sphere-v2.png',
        },
        {
            id: 'mecd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mce2d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'meecd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mce2rwd',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'wemecd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mcfe2d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'mecgd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mchhe2d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'mectud',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mcse2d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'mejcd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mce442d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'm4345ecd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mce67652d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'me234cd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'm2342ce2d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'mec76d',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'mcllle2d',
            name: 'chonky-sphere-v4.png',
        },
        {
            id: 'me324324cd',
            name: 'chonky-sphere-v3.png',
        },
        {
            id: 'wtgwermce2d',
            name: 'chonky-sphere-v4.png',
        }
    ];
    const folderChain = [{ id: 'xcv', name: 'Files', isDir: true }];
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