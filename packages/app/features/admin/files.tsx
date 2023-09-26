import { XStack } from 'tamagui'
import { PanelLayout } from '../../layout/PanelLayout'
import { PanelMenu } from './components/PanelMenu'
import { useRouter } from 'next/router';

const data = {
    "Files": [
        { "name": "Pages", "href": "/admin/files/apps/next/pages" },
        { "name": "data", "href": "/admin/files/data" },
        { "name": "common", "href": "/admin/files/packages/common" }
    ],
    "Files 2": [
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "apps", "href": "/admin/files/apps" }
    ],
}


export default function Admin({ fileData, FileBrowser }) {
    const router = useRouter()
    const parts = router.asPath.split('/')
    const section = parts.length > 2 ? parts[2].split('?')[0] : 'files' //TODO: redirect to first available path

    const getComponent = () => {
        switch(section) {
            case 'db':
                return <div>db</div>
            case 'files':
                return <FileBrowser path={fileData.CurrentPath} file={fileData.CurrentFile} filesState={fileData.filesState} />
        }
    }

    return (<PanelLayout menuContent={<PanelMenu menu={data}/>}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            {getComponent()}
        </XStack>
    </PanelLayout>)
}