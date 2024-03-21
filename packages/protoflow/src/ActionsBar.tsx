import React, { useContext } from "react";
import { FlowStoreContext } from "./store/FlowsStore";
import { Save, Code, RefreshCcw, AlertTriangle } from 'lucide-react';
import layouts from "./diagram/layouts";

export type Props = {
  onSave?: Function
  onShowCode?: Function
  onReload: Function
  hasChanges?: boolean,
  layout: 'elk' | 'code' | 'device',
  getFirstNode: Function
};

export const reLayout = async (layout, nodes, edges, setNodes, setEdges, getFirstNode, setNodesMetaData=null,nodeData=null) => {
  const _nodes = nodes.map(node => ({ ...node })) // Remove positions
  const { nodes: layoutedNodes, edges: layoutedEdges, metadata } = layout!='device'? await layouts[layout??'code'](
    _nodes,
    edges,
    getFirstNode(_nodes)
  ):await layouts[layout](
    _nodes,
    edges,
    getFirstNode(_nodes),
    nodeData
  );
  await (setNodesMetaData as any)(metadata)
  await setNodes(layoutedNodes)
  await setEdges(edges)

  return {layoutedNodes, layoutedEdges, metadata}
}

const ActionsBar = ({ layout,hasChanges, onReload, onSave, onShowCode, getFirstNode }: Props) => {
  
  const NODE_PADDING = 30;
  const size = 25
  const useFlowsStore = useContext(FlowStoreContext)
  const saveStatus = useFlowsStore(state => state.saveStatus)
  
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto', right: 0, left: 0, justifyContent: 'center', marginTop: '20px' }}>
        {onSave ? <div
          onClick={() => onSave()}
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            backgroundColor: saveStatus == 'error' ? '#EF4444' : hasChanges ? '#373737' : '#BFBFBF',
            borderRadius: '14px', width: '40px', padding: '5px', marginLeft: '6px', height: '35px'
          }}
        >
          {saveStatus == 'loading'
            ? <div id="spinner" className="lds-ring"><div></div><div></div><div></div><div></div></div>
            : (saveStatus == 'error' ? <AlertTriangle color={'white'} size={size} /> : <Save color={'white'} size={size} />)}
        </div>
          : null}
        {onShowCode ? <div
          onClick={() => onShowCode()}
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            backgroundColor: '#373737',
            borderRadius: '14px', width: '40px', padding: '5px', marginLeft: '6px', height: '35px'
          }}
        >
          <Code
            color={'white'}
            size={size} />
        </div>
          : null}
        {onReload ? <div
          onClick={() => onReload()}
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            backgroundColor: '#373737', borderRadius: '14px', width: '40px',
            padding: '5px', marginLeft: '6px', height: '35px'
          }}
        >
          <RefreshCcw color={'white'} size={size} />
        </div> : null}
      </div>
    </>
  );
};
export default ActionsBar;