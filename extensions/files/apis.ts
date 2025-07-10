import { addAction } from '@extensions/actions/coreContext/addAction';
import { addCard } from '@extensions/cards/coreContext/addCard';
import { getServiceToken } from 'protobase';

export default async (app, context) => {

    addAction({
        group: 'files',
        name: 'read',
        url: "/api/core/v1/files",
        tag: 'operations',
        description: "Read a file or directory",
        params: {
            path: "Path to the file or directory to read",
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'files',
        tag: 'operations',
        id: 'send',
        templateName: 'Read File or Directory',
        name: 'files_read',
        defaults: {
            width: 2,
            height: 8,
            type: "action",
            icon: 'file',
            name: 'files_read',
            description: 'Read a file or directory',
            params: {
                path: "Path to the file or directory to read",
            },
            rulesCode: `return await execute_action("/api/core/v1/files", userParams)`,
            displayResponse: true
        },
        emitEvent: true,
        token: getServiceToken()
    })

    addAction({
        group: 'files',
        name: 'files_download',
        url: "/api/core/v1/download",
        tag: 'operations',
        description: "Download a file from a URL",
        params: {
            path: "Path to the file to download",
            url: "URL to download the file from"
        },
        emitEvent: true,
        token: await getServiceToken()
    })

    addCard({
        group: 'files',
        tag: 'actions',
        id: 'download',
        templateName: 'Download File from URL',
        name: 'files_download',
        defaults: {
            width: 2,
            height: 9,
            type: "action",
            icon: 'download',
            name: 'files_download',
            description: 'Download a file from a URL',
            params: {
                path: "Path to the file to download",
                url: "URL to download the file from"
            },
            rulesCode: `return await execute_action("/api/core/v1/download", params)`,
            displayResponse: true
        },
        emitEvent: true,
        token: getServiceToken()
    })
}