import {
    Router,
    Key,
    Cog,
    Database,
    Boxes,
    Box,
    LayoutDashboard,
    Zap,
    Wrench,
    Blocks
} from '@tamagui/lucide-icons'
import { MonitorCog as RawMonitorCog } from 'lucide-react'
import { styled } from 'tamagui'

const MonitorCog = styled(RawMonitorCog, {
    name: 'MonitorCog',
    size: '$true',
    color: 'currentColor',
})

import { ServiceMemoryUsageChart, TotalMemoryUsage, TotalCPUUsage } from '@extensions/services/widgets'
import { TotalUsers, ListLatestUsers } from '@extensions/users/widgets'
import { LastEvents, TotalEvents } from '@extensions/events/widgets'
import { ListPages } from '@extensions/pages/widgets'
import { TotalObjects } from '@extensions/objects/widgets'
import { TotalGroups, ListGroups } from '@extensions/groups/widgets'

const enableArduinos = false

export default ({ pages, boards, objects }) => {
    const adminPages = pages.filter(p => p.pageType == 'admin' && !p.object)
    const objectsWithPage = objects ? objects.filter(o => o?.features?.adminPage) : []

    const integrations = [
        { "name": "Automations", "icon": Zap, "href": "/workspace/apis" },
        { "name": "Devices", "icon": Router, "href": "/workspace/devices" },
        { "name": "Storage", "icon": Boxes, "href": "/workspace/objects" },
        { "name": "Pages", "icon": "layout", "href": "/workspace/pages" }
    ]
    enableArduinos ? integrations.push({ "name": "Arduinos", "icon": Router, "href": "/workspace/arduinos" }) : null

    const systemBoard = { "name": "System", "icon": LayoutDashboard, "href": "/workspace/dashboard" }
    const manageBoards = { "name": "Manage Boards", "icon": MonitorCog, "href": '/workspace/boards' }

    const systemMenu = [
        { "name": "Assets", "icon": Blocks, "href": "/workspace/files?path=%2Fdata%2Fassets", "path": "" },
        { "name": "Users", "icon": "users", "href": "/workspace/users" },
        { "name": "Keys", "icon": Key, "href": "/workspace/keys" },
        { "name": "Events", "icon": "activity", "href": "/workspace/events" },
        { "name": "Services", "icon": Cog, "href": "/workspace/services" },
        { "name": "Databases", "icon": Database, href: "/workspace/databases" },
        { "name": "Files", "icon": "folder", "href": "/workspace/files?path=/", "path": "" }
    ]

    const objectsMenu = objectsWithPage.length ? objectsWithPage.map((obj) => {
        return { "name": obj.name.charAt(0).toUpperCase() + obj.name.slice(1), "icon": Box, "href": ('/workspace/') + obj.features.adminPage }
    }) : [];

    const adminMenu = adminPages.map((page) => {
        return { "name": page.name.charAt(0).toUpperCase() + page.name.slice(1), "icon": Wrench, "href": page.route }
    })

    const initialData = {
        Boards: [],
        ...(objectsMenu.length ? { Objects: objectsMenu } : {}),
        ...(adminMenu.length ? { Admin: adminMenu } : {}),
        Integrations: integrations,
        System: systemMenu
    }

    const boardsGroupByCategory = boards ? boards.reduce((acc, board) => {
        const category = board.category || 'Boards';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ "name": board.name.charAt(0).toUpperCase() + board.name.slice(1), "icon": board.icon ?? LayoutDashboard, "href": '/workspace/boards/view?board=' + board.name });
        return acc;
    }, initialData) : initialData;


    boardsGroupByCategory['Boards'].unshift(systemBoard);
    boardsGroupByCategory['Boards'].push(manageBoards);


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
                { key: 'listgroups', content: <ListGroups title='Groups' id={'listgroups'} /> },
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
            ...boardsGroupByCategory,
        }
    }
}
