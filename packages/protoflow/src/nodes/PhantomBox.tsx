import React, { memo, useContext } from 'react';
import Node, { HandleOutput } from '../Node';
import Text from '../diagram/NodeText';
import { FlowStoreContext } from "../store/FlowsStore";
import { useNodeColor } from '../diagram/Theme';

const PhantomBox = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const setMenu = useFlowsStore(state => state.setMenu)
    return (
        <Node style={{borderColor:'#bbb', borderStyle: 'dashed', borderWidth:2}} output={false} node={node} isPreview={!id} id={id} color={color}>
            <div onClick={(event: any) => {
                const { clientX, clientY } = event;
                console.log('event: ', event)
                console.log('locationX: ', clientX, 'locationY: ', clientY)
                setMenu('open', [clientX,clientY], id)
            }}>
                <Text style={{color: '#bbb', fontSize: '25px'}}>+</Text>
            </div>
            <HandleOutput id={id} param={{ label: '', field: 'value', type: 'output' }} style={{backgroundColor: '#bbb', marginTop: '-25px'}}/>
        </Node>
    );
}
PhantomBox.keywords = ['phantom']

PhantomBox.dump = (node, nodes, edges, nodesData) => {
  return ''
}


export default memo(PhantomBox)