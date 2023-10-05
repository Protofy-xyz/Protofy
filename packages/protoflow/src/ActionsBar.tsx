import React, { useCallback, useContext } from "react";
import { FlowStoreContext } from "./store/FlowsStore";
import { useReactFlow } from 'reactflow';
import { Save, Code, CircleDot, RefreshCcw, AlertTriangle } from 'lucide-react';
import layouts from "./diagram/layouts";
//import './styles.css'

export type Props = {
  onSave?: Function
  onShowCode?: Function
  onReload: Function
  hasChanges?: boolean,
  layout: 'elk' | 'code',
  getFirstNode: Function
};

export const reLayout = async (layout, nodes, edges, setNodes, setEdges, getFirstNode, setNodesMetaData=null) => {
  const _nodes = nodes.map(node => ({ ...node })) // Remove positions
  const { nodes: layoutedNodes, edges: layoutedEdges, metadata } = await layouts[layout??'code'](
    _nodes,
    edges,
    getFirstNode(_nodes)
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
  const { fitView, setNodes, setEdges, getEdges, getNodes } = useReactFlow();

  const handleTransform = useCallback(() => {
    //@ts-ignore
    fitView({ zoom: 1, duration: 800, padding: 0.5 })
  }, [fitView]);
  
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
        <div
          onClick={() => handleTransform()}
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            backgroundColor: '#373737', borderRadius: '14px', width: '40px',
            padding: '5px', marginLeft: '6px', height: '35px'
          }}
        >
          <CircleDot color={'white'} size={size} />
        </div>
      </div>
    </>
  );
};
export default ActionsBar;