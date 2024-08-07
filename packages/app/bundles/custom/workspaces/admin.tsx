import { Router, Inbox, Library, ToyBrick, Key, Cog, Database, DatabaseBackup, Package, Boxes, Box, LayoutDashboard } from '@tamagui/lucide-icons'
import { ServiceMemoryUsageChart, TotalMemoryUsage, TotalCPUUsage } from 'protolib/bundles/services/widgets'
import { DashboardCard } from 'protolib/components/DashboardCard'


export default ({pages}) => {
    const adminPages = pages.filter(p => p.pageType == 'admin' && p.object && p.route.startsWith('/workspace/'))

    return {
        "default": "/workspace/prod/services",
        "label": "Admin panel",
        "assistant": true,
        "logs": true,
        "dev": {
            "default": "/workspace/dev/services",
            "label": "Dev panel"
        },
        "dashboards": [{
            "name": "Dashboard",
            "content": [
                { key: 'a', content: <ServiceMemoryUsageChart title="Memory Usage" id={'a'}/>},
                { key: 'b', content: <TotalMemoryUsage title='Total Memory Usage' id={'b'}/>},
                { key: 'c', content: <TotalCPUUsage title='Total CPU Usage' id={'c'}/>},
                //     { key: 'f', content: <DashboardCard title='Box C' id={'d'}>
                //     <Text style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                //         <Image url="/images/protofito.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                //     </Text>
                // </DashboardCard>},
            ],
            "layout": {
                lg: [
                    { i: 'a', x: 0, y: 0, w: 6, h: 12, isResizable: false },
                    { i: 'b', x: 6, y: 0, w: 3, h: 6, isResizable: false },
                    { i: 'c', x: 6, y: 3, w: 3, h: 6, isResizable: false },
                ],
                md: [
                    { i: 'a', x: 0, y: 0, w: 6, h: 12, isResizable: false },
                    { i: 'b', x: 6, y: 0, w: 3, h: 4, isResizable: false },
                    { i: 'c', x: 0, y: 2, w: 4, h: 5, isResizable: false },
                ],
                sm: [
                    { i: 'a', x: 0, y: 0, w: 6, h: 12, isResizable: false },
                    { i: 'b', x: 6, y: 0, w: 3, h: 4, isResizable: false },
                    { i: 'c', x: 0, y: 2, w: 2, h: 5, isResizable: false },
                ],
            },
            "label": "Dashboard"
        }],
        "menu": {
            ...(adminPages.length ? {"CMS": adminPages.map((page) => {
                return { "name": page.object.charAt(0).toUpperCase() + page.object.slice(1), "icon": Box, "type": page.route.split('/')[2], "path": page.route.split('/').slice(3), previewMode: page.status?.web == 'unpublished' }
            })}: {}),
            "System": [
                { "name": "Dashboard", "icon": LayoutDashboard, "type": "dashboard", "path": "/" },
                { "name": "Users", "icon": "users", "type": "users", "path": "/" },
                { "name": "Groups", "icon": "groups", "type": "groups", "path": "/" },
                { "name": "Keys", "icon": Key, "type": "keys", "path": "/" },
                { "name": "Events", "icon": "activity", "type": "events", "path": "/" },
                { "name": "Messages", "icon": Inbox, "type": "messages", "path": "/"},
                { "name": "Services", "icon": Cog, "type": "services", "path": "/"},
                { "name": "Databases", "icon": Database, "type": "databases", "path": "/system"},
            ],
            "Development": [
                { "name": "Objects", "icon": Boxes, "type": "objects", "path": "/" },//"visibility": ["development"]
                { "name": "Pages", "icon": "layout", "type": "pages", "path": "/" },
                { "name": "Automations", "icon": ToyBrick, "type": "apis", "path": "/" },
            ],
            "Content": [
                { "name": "Files", "icon": "folder", "type": "files", "path": "?path=/" },
                { "name": "Resources", "icon": Library, "type": "resources", "path": "/"},
                { "name": "Public", "icon": "doorOpen", "type": "files", "path": "?path=/apps/next/public" },
                { "name": "Databases", "icon": DatabaseBackup, "type": "databases", "path": "/"},
            ],
            "IoT Devices":[
                { "name": "Devices", "icon": Router, "type":"devices", "path": "/"},
                { "name": "Definitions", "icon": "bookOpen", "type":"deviceDefinitions", "path": "/"}
            ]
        }
    }
}
