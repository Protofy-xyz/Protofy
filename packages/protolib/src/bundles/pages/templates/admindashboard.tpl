/* @my/ui is wrapper for tamagui. Any component in tamagui can be imported through @my/ui
use result = await API.get(url) or result = await API.post(url, data) to send requests
API.get/API.post will return a PendingResult, with properties like isLoaded, isError and a .data property with the result
if you call paginated apis, you will need to wait for result.isLoaded and look into result.data.items, since result.data is an object with the pagination.
Paginated apis return an object like: {"itemsPerPage": 25, "items": [...], "total": 20, "page": 0, "pages": 1}
*/

import { Protofy, API } from 'protobase'
import { SSR } from 'protolib/lib/SSR';
import { AdminPage } from 'protolib/components/AdminPage'
import { DashboardGrid } from 'protolib/components/DashboardGrid';
import { withSession } from 'protolib/lib/Session';
import { YStack } from '@my/ui';
import { ServiceMemoryUsageChart, TotalMemoryUsage, TotalCPUUsage, TotalUsers, LastEvents, ListPages, TotalObjects, ListLatestUsers, TotalGroups, ListGroups, TotalEvents } from 'protolib/bundles/widgets';

const isProtected = Protofy("protected", {{protected}})

const itemsContent =  [
    { key: 'servicememorychart', content: <ServiceMemoryUsageChart title="Memory Usage" id={'servicememorychart'} /> },
    { key: 'totalmemory', content: <TotalMemoryUsage title='Total Memory Usage' id={'totalmemory'} /> },
    { key: 'totalcpu', content: <TotalCPUUsage title='Total CPU Usage' id={'totalcpu'} /> },
    { key: 'totalusers', content: <TotalUsers title='Total users' id={'totalusers'} /> },
    { key: 'lastevents', content: <LastEvents title='Last Events' id={'lastevents'} /> },
    { key: 'listpages', content: <ListPages title='Pages' id={'listpages'} /> },
    { key: 'listgroups', content: <ListGroups title='Groups' id={'listgroups'} />},
    { key: 'totalobjects', content: <TotalObjects title='Total objects' id={'totalobjects'} /> },
    { key: 'listlatestusers', content: <ListLatestUsers title='Latest Users' id={'listlatestusers'} /> },
    { key: 'totalgroups', content: <TotalGroups title='Total groups' id={'totalgroups'} /> },
    { key: 'totalevents', content: <TotalEvents title='Total events' id={'totalevents'} /> },
]
const layouts = {
    "lg": [
        { "i": "totalcpu", "x": 0, "y": 0, "w": 3, "h": 6, "isResizable": true },
        { "i": "totalmemory", "x": 3, "y": 0, "w": 3, "h": 6, "isResizable": true },
        { "i": "totalusers", "x": 6, "y": 0, "w": 2, "h": 6, "isResizable": true },
        { "i": "listlatestusers", "x": 9, "y": 0, "w": 4, "h": 6, "isResizable": true },
        { "i": "servicememorychart", "x": 0, "y": 6, "w": 6, "h": 14, "isResizable": true },
        { "i": "lastevents", "x": 6, "y": 6, "w": 6, "h": 14, "isResizable": true },
        { "i": "totalgroups", "x": 0, "y": 20, "w": 2, "h": 6, "isResizable": true },
        { "i": "listgroups", "x": 2, "y": 20, "w": 3, "h": 6, "isResizable": true },
        { "i": "totalevents", "x": 5, "y": 20, "w": 2, "h": 6, "isResizable": true },
        { "i": "totalobjects", "x": 7, "y": 20, "w": 2, "h": 6, "isResizable": true },
        { "i": "listpages", "x": 9, "y": 20, "w": 3, "h": 6, "isResizable": true }
    ],
    "md": [
        { "i": "totalcpu", "x": 0, "y": 0, "w": 3, "h": 6, "isResizable": true },
        { "i": "totalmemory", "x": 3, "y": 0, "w": 4, "h": 6, "isResizable": true },
        { "i": "totalusers", "x": 7, "y": 0, "w": 3, "h": 6, "isResizable": true },
        { "i": "listlatestusers", "x": 0, "y": 6, "w": 12, "h": 6, "isResizable": true },
        { "i": "servicememorychart", "x": 0, "y": 12, "w": 12, "h": 12, "isResizable": true },
        { "i": "lastevents", "x": 0, "y": 24, "w": 12, "h": 12, "isResizable": true },
        { "i": "totalgroups", "x": 0, "y": 36, "w": 3, "h": 6, "isResizable": true },
        { "i": "listgroups", "x": 3, "y": 36, "w": 6, "h": 6, "isResizable": true },
        { "i": "totalevents", "x": 9, "y": 36, "w": 3, "h": 6, "isResizable": true },
        { "i": "totalobjects", "x": 0, "y": 42, "w": 3, "h": 6, "isResizable": true },
        { "i": "listpages", "x": 3, "y": 42, "w": 9, "h": 6, "isResizable": true }
    ],
    "sm": [
        { "i": "totalcpu", "x": 0, "y": 0, "w": 6, "h": 6, "isResizable": true },
        { "i": "totalmemory", "x": 0, "y": 6, "w": 6, "h": 6, "isResizable": true },
        { "i": "totalusers", "x": 0, "y": 12, "w": 6, "h": 6, "isResizable": true },
        { "i": "listlatestusers", "x": 0, "y": 18, "w": 6, "h": 6, "isResizable": true },
        { "i": "servicememorychart", "x": 0, "y": 24, "w": 6, "h": 12, "isResizable": true },
        { "i": "lastevents", "x": 0, "y": 36, "w": 6, "h": 12, "isResizable": true },
        { "i": "totalgroups", "x": 0, "y": 48, "w": 6, "h": 6, "isResizable": true },
        { "i": "listgroups", "x": 0, "y": 54, "w": 6, "h": 6, "isResizable": true },
        { "i": "totalevents", "x": 0, "y": 60, "w": 6, "h": 6, "isResizable": true },
        { "i": "totalobjects", "x": 0, "y": 66, "w": 6, "h": 6, "isResizable": true },
        { "i": "listpages", "x": 0, "y": 72, "w": 6, "h": 6, "isResizable": true }
    ]
}

Protofy("pageType", "admin")



export default {
    route: Protofy("route", "{{route}}"),
    component: ({pageState, initialItems, pageSession, extraData}:any) => {
        return (<AdminPage title="{{name}}" pageSession={pageSession}>
                <YStack flex={1} padding={20}>
                    <DashboardGrid items={itemsContent} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white" />
                </YStack>
        </AdminPage>)
    }, 
    getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}