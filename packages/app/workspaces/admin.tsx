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
    Bot
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

export default ({ pages }) => {
    const adminPages = pages.filter(p => p.pageType == 'admin' && p.object && p.route.startsWith('/workspace/'))

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
            ...(adminPages.length ? {
                "CMS": adminPages.map((page) => {
                    const parts = page.route.split('/')
                    return { "name": page.object.charAt(0).toUpperCase() + page.object.slice(1), "icon": Box, "type": parts[2], "path": '/', previewMode: page.status?.adminpanel == 'unpublished' }
                })
            } : {}),
            "System": [
                { "name": "Dashboard", "icon": LayoutDashboard, "type": "", "path": "/" },
                { "name": "Users", "icon": "users", "type": "users", "path": "/" },
                { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
                { "name": "Keys", "icon": Key, "type": "keys", "path": "/" },
                { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
                { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/" },
                { "name": "Services", "icon": Cog, "type": "services", "path": "/" },
                { "name": "Databases", "icon": Database, "type": "databases", "path": "/system" },
            ],
            "Development": [
                { "name": "Objects", "icon": Boxes, "type": "objects", "path": "/" },//"visibility": ["development"]
                { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
                { "name": "Automations", "icon": ToyBrick, "type": "apis", "path": "/" },
            ],
            "State Machines": [
                { "name": "Instances", "icon": Power, "type": "stateMachines", "path": "/" },
                { "name": "Definitions", "icon": FileCog, "type": "stateMachineDefinitions", "path": "/" },
            ],
            "Content": [
                { "name": "Files", "icon": "folder", "type": "files", "path": "?path=/" },
                { "name": "Resources", "icon": Library, "type": "resources", "path": "/" },
                { "name": "Public", "icon": "doorOpen", "type": "files", "path": "?path=/apps/next/public" },
                { "name": "Databases", "icon": DatabaseBackup, "type": "databases", "path": "/" },
            ],
            "Fleets": [
                { "name": "Agents", "icon": Bot, "type": "agents", "path": "/" },
                { "name": "Devices", "icon": Router, "type": "devices", "path": "/" },
                { "name": "Definitions", "icon": "bookOpen", "type": "deviceDefinitions", "path": "/" }
            ]
        }
    }
}
