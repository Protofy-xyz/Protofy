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
    const objectsWithPage = objects ? objects.filter(o => o?.features?.adminPage) : []

    const integrations = [
        { "name": "Automations", "icon": Zap, "href": "/workspace/apis" },
        { "name": "Devices", "icon": Router, "href": "/workspace/devices" },
        { "name": "Storage", "icon": Boxes, "href": "/workspace/objects" },
        { "name": "Pages", "icon": "panels-top-left", "href": "/workspace/pages" },
        { "name": "Events", "icon": "activity", "href": "/workspace/events" },
    ]
    enableArduinos ? integrations.push({ "name": "Arduinos", "icon": Router, "href": "/workspace/arduinos" }) : null

    // const systemBoard = { "name": "System", "icon": LayoutDashboard, "href": "/workspace/dashboard" }
    const manageBoards = { "name": "Manage Boards", "icon": MonitorCog, "href": '/workspace/boards' }

    const systemMenu = [
        { "name": "Assets", "icon": Blocks, "href": "/workspace/assets?path=%2Fdata%2Fassets", "path": "" },
        { "name": "Users", "icon": "users", "href": "/workspace/users" },
        { "name": "Keys", "icon": Key, "href": "/workspace/keys" },
        { "name": "Services", "icon": Cog, "href": "/workspace/services" },
        { "name": "Databases", "icon": Database, href: "/workspace/databases" },
        { "name": "Files", "icon": "folder", "href": "/workspace/files?path=/", "path": "" }
    ]

    const objectsMenu = objectsWithPage.length ? objectsWithPage.map((obj) => {
        return { "name": obj.name.charAt(0).toUpperCase() + obj.name.slice(1), "icon": Box, "href": ('/workspace/') + obj.features.adminPage }
    }) : [];

    const initialData = {
        Boards: [],
        ...(objectsMenu.length ? { Storage: objectsMenu } : {}),
        Integrations: integrations,
        Settings: systemMenu
    }

    const boardsGroupByCategory = boards ? boards.reduce((acc, board) => {
        const category = board.category || 'Boards';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ "name": board.name.charAt(0).toUpperCase() + board.name.slice(1), "icon": board.icon ?? LayoutDashboard, "href": '/workspace/boards/view?board=' + board.name });
        return acc;
    }, initialData) : initialData;


    // boardsGroupByCategory['Boards'].unshift(systemBoard);
    boardsGroupByCategory['Boards'].push(manageBoards);


    return {
        "default": "/workspace/",
        "label": "Admin panel",
        "assistant": true,
        "logs": true,
        "menu": {
            ...boardsGroupByCategory,
        }
    }
}
