import React, { useContext } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import DiagramEdge from './diagram/Edge';
import useTheme from './diagram/Theme'
import { FlowStoreContext } from './store/FlowsStore'

export default function CustomEdge(props: EdgeProps, bridgeNode: boolean = false) {
  const useFlowsStore = useContext(FlowStoreContext)
  const setMenu = useFlowsStore(state => state.setMenu)
  const nodeData = useFlowsStore(state => state.nodeData[props.source] ?? {})

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  });

  const onOpenMenu = (event) => {
    setMenu("open", [event.clientX, event.clientY], {
      edgeId: props.id,
      type: 'edge',
      sourceHandle: props.sourceHandleId,
      source: props.source,
      targetHandle: props.targetHandleId,
      target: props.target,
    })
  }

  const isSourceLayouted = nodeData?._metadata?.layouted ? true : false

  const edgeProps = {
    ...props,
    color: useTheme("edgeColor")
  }

  const edgeColor = useTheme('edgeColor')
  const flowOutputColor = useTheme('flowOutputColor')

  return isSourceLayouted?(
    <DiagramEdge
      {...edgeProps}
    >
      {bridgeNode ? <g transform={`translate(${edgeCenterX}, ${edgeCenterY})`}>
        <rect
          style={{ cursor: 'pointer', pointerEvents: 'all', strokeWidth: '2px', stroke: edgeColor, fill: flowOutputColor }}
          onClick={onOpenMenu}
          x={-10} y={-10} width={20} ry={20} rx={20} height={20}
        />
        <text
          style={{ fontWeight: 600, pointerEvents: 'none', userSelect: 'none', fill: edgeColor, fontSize: '18px' }}
          y={5} x={-6}
        >
          {'+'}
        </text>
      </g> : null}
    </DiagramEdge>
  ):null;
}
