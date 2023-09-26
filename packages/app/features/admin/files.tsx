import { XStack } from 'tamagui'
import { createApiAtom, useHydratedAtom } from 'protolib'
import { PanelLayout } from '../../layout/PanelLayout'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useThemeSetting } from '@tamagui/next-theme'
import { PanelMenu } from './components/PanelMenu'



const data = {
    "Files": [
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "data", "href": "/admin/files/data" },
        { "name": "packages", "href": "/admin/files/packages" }
    ],
    "Files 2": [
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "apps", "href": "/admin/files/apps" },
        { "name": "apps", "href": "/admin/files/apps" }
    ],
}


export default function Admin({ filesState, FileBrowser, CurrentPath, CurrentFile }) {
    

    return (<PanelLayout menuContent={<PanelMenu menu={data}/>}>
        <XStack f={1} px={"$4"} flexWrap='wrap'>
            <FileBrowser path={CurrentPath} file={CurrentFile} filesState={filesState} />
        </XStack>
    </PanelLayout>)
}