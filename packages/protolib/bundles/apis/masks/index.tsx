import DevicePub from './DevicePub';
import ApiResponse from './ApiResponse'
import ApiMask from './ApiMask'
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
          if(nodeData.to == "app.get"){
          console.log("param2: ",nodeData.param2);
          console.log("nodeData: ",nodeData);
          }
          return(
          node.type == "CallExpression"
          && nodeData.param2?.startsWith('(req,res) =>')
          && (nodeData.to == 'app.get' || nodeData.to == 'app.post')
        )},
        getComponent: ApiMask,
        filterChildren: filterCallback(),
        restoreChildren: restoreCallback(),
        getInitialData: () => { return { to: 'app.get', param1: '"/api/v1/"', param2: '(req,res) =>' } }
    }
]

export default apiMasks;