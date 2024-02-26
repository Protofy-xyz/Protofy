import DevicePub from './DevicePub';
// import dynamic from 'next/dynamic'
// const DevicePub = dynamic(() => import('./DevicePub'))
const apiMasks = [{
    id: 'devicePub',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('devicePub'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <DevicePub node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'devicePub', param1: '"none"', param2: '"none"', param3: '"none"' } }
  }
]

export default apiMasks;