import {
    Router,
    Inbox,
    Library,
    ToyBrick,
    Key,
    Cog,
    Database,
    DatabaseBackup,
    Package,
    Boxes,
    Box,
    LayoutDashboard,
    Power,
    FileCog,
    Bot,
    Plus
} from '@tamagui/lucide-icons'
import {
    ServiceMemoryUsageChart,
    TotalMemoryUsage,
    TotalCPUUsage,
    TotalUsers,
    LastEvents,
    ListPages,
    TotalObjects,
    ListLatestUsers,
    TotalGroups,
    ListGroups,
    TotalEvents
} from '../bundles/widgets'

import { DashboardCard } from 'protolib/components/DashboardCard'

const enableBoards = false

export default ({ pages, boards }) => {
    const adminPages = pages.filter(p => p.pageType == 'admin')

    return {
        "default": "/workspace/",
        "label": "Admin panel",
        "assistant": true,
        "logs": true,
        "dashboards": [{
            "name": "Dashboard",
            "content": [
                { key: 'servicememorychart', content: <ServiceMemoryUsageChart title="Memory Usage" id={'servicememorychart'} /> },
                { key: 'totalmemory', content: <TotalMemoryUsage title='Total Memory Usage' id={'totalmemory'} /> },
                { key: 'totalcpu', content: <TotalCPUUsage title='Total CPU Usage' id={'totalcpu'} /> },
                { key: 'totalusers', content: <TotalUsers title='Total users' id={'totalusers'} /> },
                { key: 'lastevents', content: <LastEvents title='Last Events' id={'lastevents'} /> },
                { key: 'listpages', content: <ListPages title='Pages' id={'listpages'} /> },
                {key: 'listgroups', content: <ListGroups title='Groups' id={'listgroups'} />},
                { key: 'totalobjects', content: <TotalObjects title='Total objects' id={'totalobjects'} /> },
                { key: 'listlatestusers', content: <ListLatestUsers title='Latest Users' id={'listlatestusers'} /> },
                { key: 'totalgroups', content: <TotalGroups title='Total groups' id={'totalgroups'} /> },
                { key: 'totalevents', content: <TotalEvents title='Total events' id={'totalevents'} /> },
                //     { key: 'f', content: <DashboardCard title='Box C' id={'totalusers'}>
                //     <Text style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                //         <Image url="/images/protofito.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                //     </Text>
                // </DashboardCard>},
            ],
            "layout": {
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
            },
            "label": "Dashboard"
        }],
        "menu": {
            ...(enableBoards) ? {
                "Boards": (boards ? boards.map((board) => {
                    return { "name": board.name.charAt(0).toUpperCase() + board.name.slice(1), "icon": LayoutDashboard, "href": '/workspace/boards/'+board.name }
                }) : []).concat([{ "name": "Create Board", "icon": Plus, "href": '/workspace/boards' }])
            } : {},
            ...(adminPages.length ? {
                "CMS": adminPages.map((page) => {
                    return { "name": page.name.charAt(0).toUpperCase() + page.name.slice(1), "icon": Box, "href": page.route }
                })
            } : {}),
            "System": [
                { "name": "Dashboard", "icon": LayoutDashboard, "href": "/workspace/dashboard" },
                { "name": "Users", "icon": "users", "href": "/workspace/users" },
                { "name": "Keys", "icon": Key, "href": "/workspace/keys" },
                { "name": "Events", "icon": "activity", "href": "/workspace/events" },
                { "name": "Messages", "icon": Inbox, "href": "/workspace/messages" },
                { "name": "Services", "icon": Cog, "href": "/workspace/services" },
                { "name": "Databases", "icon": Database, "type": "databases", "path": "/system" },
            ],
            "Development": [
                { "name": "Objects", "icon": Boxes, "href": "/workspace/objects" },//"visibility": ["development"]
                { "name": "Pages", "icon": "layout", "href": "/workspace/pages" },
                { "name": "Automations", "icon": ToyBrick, "href": "/workspace/apis" },
            ],
            "State Machines": [
                { "name": "Instances", "icon": Power, "href": "/workspace/stateMachines" },
                { "name": "Definitions", "icon": FileCog, "href": "/workspace/stateMachineDefinitions" },
            ],
            "Content": [
                { "name": "Files", "icon": "folder", "href": "/workspace/files?path=/", "path": "" },
                { "name": "Resources", "icon": Library, "href": "/workspace/resources" },
                { "name": "Public", "icon": "doorOpen", "href": "/workspace/files?path=/apps/next/public" }
            ],
            "Devices": [
                { "name": "Devices", "icon": Router, "href": "/workspace/devices" },
                { "name": "Definitions", "icon": "bookOpen", "href": "/workspace/deviceDefinitions" }
            ]
        }
    }
}
