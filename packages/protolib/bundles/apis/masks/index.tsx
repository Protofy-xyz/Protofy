import DevicePub from './DevicePub';
import DeviceSub from './DeviceSub';
import ApiResponse from './ApiResponse';
import ApiMask from './ApiMask';
import Logger from './Logger';

import { filterCallback, restoreCallback } from 'protoflow';

const apiMasks = [
    {
        id: 'devicePub',
        type: 'CallExpression',
        check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('devicePub'), //TODO: Change output function name
        getComponent: (node, nodeData, children) => <DevicePub node={node} nodeData={nodeData} children={children} />,
        getInitialData: () => { return { to: 'devicePub', param1: '"none"', param2: '"none"', param3: '"none"' } }
    },
    {
        id: 'deviceSub',
        type: 'CallExpression',
        check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('deviceSub'),
        getComponent: (node, nodeData, children) => <DeviceSub node={node} nodeData={nodeData} children={children} />,
        filterChildren: filterCallback("4"),
        restoreChildren: restoreCallback("4"),
        getInitialData: () => { return { to: 'deviceSub', param1: '"none"', param2: '"none"', param3: '"none"', param4: '(message,topic) =>' } }
    },
    {
        id: 'logger',
        type: 'CallExpression',
        check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('logger.'),
        getComponent: (node, nodeData, children) => <Logger node={node} nodeData={nodeData} children={children} />,
        getInitialData: () => { return { to: 'logger.info', param1: '{}', param2: '"message"' } }
    },
    {
        id: 'res.send',
        type: 'CallExpression',
        check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('res.send'), //TODO: Change output function name
        getComponent: (node, nodeData, children) => <ApiResponse node={node} nodeData={nodeData} children={children} />,
        getInitialData: () => { return { to: 'res.send', param1: '"Response"' } }
    },
    {
        id: 'CloudApi',
        type: 'CallExpression',
        check: (node, nodeData) => {
            return (
                node.type == "CallExpression"
                && nodeData.param2?.startsWith('(req,res) =>')
                && (nodeData.to == 'app.get' || nodeData.to == 'app.post')
            )
        },
        getComponent: ApiMask,
        filterChildren: filterCallback(),
        restoreChildren: restoreCallback(),
        getInitialData: () => { return { to: 'app.get', param1: '"/api/v1/"', param2: '(req,res) =>' } }
    }
]

export default apiMasks;