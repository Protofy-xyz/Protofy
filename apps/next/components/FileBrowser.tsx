import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileNavbar, FileBrowser, FileToolbar, FileList, FileContextMenu} from 'chonky';
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
    ];
    const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }];
    const theme = useTheme()
    console.log('theme: ', theme.background)
    const onScroll=() => {}
    return (
        <YStack f={1} backgroundColor={"$colorTransparent"} pt={4} pl={4}>
            <FileBrowser disableSelection={true} darkMode={resolvedTheme=='dark'} files={files} folderChain={folderChain}>
                <FileNavbar />
                <FileToolbar />
                <FileList onScroll={onScroll}/>
                {/* <FileContextMenu/> */}
            </FileBrowser>
        </YStack>

  
    );
};

export default WebFileBrowser