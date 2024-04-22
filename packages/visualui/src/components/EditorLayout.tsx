import { useRef, useState, useEffect } from "react";
import Head from 'next/head'
import { Frame, useEditor } from "@protocraft/core";
import useKeypress from 'react-use-keypress';
import Diff from 'deep-diff'
import { Source } from "app/models";
import { withTopics } from "react-topics";
import ErrorBoundary from './ErrorBoundary'
import { notify, computePreviousPositions } from "../utils/utils";
import { Stack, Spinner } from "@my/ui"
import { useVisualUiComms } from "../visualUiHooks";
import { frames } from "../utils/frames"
import { useUpdateEffect } from "usehooks-ts"

export type EditorProps = {
  children?: any;
  currentPageContent: string;
  topics: any;
  resolveComponentsDir: string;
  onReady?: Function;
  metadata?: any;
  codeRef?: any;
  contextAtom: any;
  frame: string;
};


const Editor = ({ frame = "desktop", topics, currentPageContent, resolveComponentsDir, onReady = () => { }, metadata = {}, contextAtom = null, codeRef }: EditorProps) => {
  const paper = useRef<any>()
  const [loading, setLoading] = useState(true);
  const [currentPageInitialJson, setCurrentPageInitialJson] = useState({});
  const [previousNodes, setPreviousNodes] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState();

  const { publish, data } = topics;
  var previousDiffs
  const { actions, query, connectors } = useEditor((state, query) => {
    const currentEditorNodes: any = JSON.parse(query.serialize())
    const diffs = Diff.diff(currentPageInitialJson, JSON.parse(query.serialize()))
    setSelectedNodeId(state.events.selected?.keys().next().value) // state.events.selected returns a Set{}, keys() reutnrs an iterator, and then we get the first element of iterator doing next()
    const hasChanges = diffs?.length > 0
    const nodesChanges = Diff.diff(previousNodes, currentEditorNodes)
    var skip = (query.getOptions() as any).skipTopic
    if (!skip && nodesChanges?.length && JSON.stringify(nodesChanges) != previousDiffs) {
      var topicParams = {}
      if (nodesChanges.filter(d => d.kind == 'N').length == 1) { //case add
        const newChange = nodesChanges.find(d => d.kind == 'N')
        const isProp = newChange.path[1] == 'props'
        const newNodeId = newChange.path[0]

        if (isProp) { // case new prop
          topicParams = {
            action: 'edit-node',
            nodeId: newNodeId,
            value: newChange.rhs,
            type: 'prop',
            field: newChange.path[2]
          }

        } else { // case new node
          const parentId = currentEditorNodes[newNodeId]['parent']
          const childrenPos = currentEditorNodes[parentId].nodes.findIndex(n => n == newNodeId)
          const _data = currentEditorNodes[newNodeId].custom
          topicParams = {
            action: 'add-node',
            nodeId: newNodeId,
            nodeName: currentEditorNodes[newNodeId]['displayName'],
            parent: parentId,
            childrenPos: childrenPos,
            data: _data,
            nodeProps: currentEditorNodes[newNodeId]['props']
          }
        }

        notify(topicParams, publish)
      } else if (nodesChanges.find(d => d.kind == 'D')) { //case delete
        const deletedNodes = nodesChanges.filter(d => d.kind == 'D').map(n => n.path[0])
        const parentId = nodesChanges.find(d => d.kind == 'A').path[0]
        topicParams = {
          action: 'delete-node',
          deletedNodes: deletedNodes,
          parent: parentId
        }
        notify(topicParams, publish)
      } else if (nodesChanges.find(d => d.kind == 'E')) { //case edit
        const movedParent_diff = nodesChanges.find(d => d.kind == 'E' && d.path[1] == 'parent')
        const children_diff = nodesChanges.find(d => d.kind == 'E' && d.path[2] == 'children')
        const props_diff = nodesChanges.find(d => d.kind == 'E' && d.path[1] == 'props')
        const move_diff = nodesChanges.find(d => d.kind == 'E' && d.path[1] == "nodes");

        if (children_diff || props_diff) { // edited prop or child text
          const type = children_diff ? 'children' : 'prop'
          var diff = type == 'children' ? children_diff : props_diff
          const nodeId = diff.path[0]
          const value = diff['rhs']

          topicParams = {
            action: 'edit-node',
            nodeId: nodeId,
            value: value,
            type: type,
            field: diff.path[2],
            debounce: type == 'children'
          }
        } else if (movedParent_diff) { // moved changing parent
          const nodeId_moved = movedParent_diff.path[0];
          const nodeId_newParent = movedParent_diff.rhs;
          const nodeId_oldParent = movedParent_diff.lhs;
          const oldPos = previousNodes[nodeId_oldParent].nodes.findIndex(n => n == nodeId_moved);
          const newPos_diff = nodesChanges.find(d => d.kind == 'E' && d.path[0] == nodeId_newParent && d.rhs == nodeId_moved)
          const newPos = newPos_diff?.path[2] ?? -1; // If no find change position, then means that is added to the last position of parent childs
          topicParams = {
            action: 'move-node',
            isSameParent: false,
            nodeId: nodeId_moved,
            oldParentId: nodeId_oldParent,
            newParentId: nodeId_newParent,
            newPos: newPos,
            oldPos: oldPos
          }
        } else { // moved inside same parent
          const parent = move_diff.path[0];
          const newChildrensIds = nodesChanges.sort((a, b) => a.path[2] - b.path[2]).map(d => d.rhs);
          const oldChildrensIds = previousNodes[parent].nodes;
          const childrenIndexes = computePreviousPositions(oldChildrensIds, newChildrensIds)
          topicParams = {
            action: 'move-node',
            isSameParent: true,
            parent: parent,
            childrenIndexes: childrenIndexes
          }
        }
        notify(topicParams, publish)
      }
      previousDiffs = JSON.stringify(nodesChanges)
      setPreviousNodes(currentEditorNodes)
    }
    return {
      hasChanges,
      currentEditorNodes,
      enabled: state.options.enabled
    }
  });

  const appendNewNodeToTree = (prevNodes, newNodeId, newNodeData, parentId, childrenIndex) => {
    prevNodes[newNodeId] = newNodeData;
    prevNodes[parentId].nodes.splice(childrenIndex, 0, newNodeId);
    let newNodes = prevNodes;
    return newNodes
  }

  const loadEditorNodes = async (cnt) => {
    const source: Source = Source.parse(cnt, metadata)
    let editorNodes = source.data()
    setCurrentPageInitialJson(editorNodes)
    const availableComponents = query?.getOptions()?.resolver ?? {}
    const availableCompArr = Object.keys(availableComponents)
    try {
      var unknownNodes = {}
      Object.keys(editorNodes).forEach(n => {
        if (!availableCompArr.includes(editorNodes[n].displayName)) {
          let replacedNode = {
            ...editorNodes[n],
            custom: {
              ...editorNodes[n].custom,
              unknown: true
            },
            type: {
              ...editorNodes[n].type,
              resolvedName: "Unknown"
            }
          }
          unknownNodes[n] = replacedNode
        }
      })
      actions.deserialize({ ...editorNodes, ...unknownNodes })
    } catch (e) {
      throw "Error loading editor nodes"
    }
  }

  const updatesPropsWithContext = () => {
    const currNodes = JSON.parse(query.serialize())
    const nodesArr = Object.keys(currNodes)
    const ndsWithContext = nodesArr.filter(n => currNodes[n].custom?.context && Object.keys(currNodes[n].custom?.context).length > 0)
    if (ndsWithContext.length == 0) return

    //updates identifiers values from context
    actions.setOptions(options => options['skipTopic'] = true)
    ndsWithContext.forEach(nd => {
      var ctx = currNodes[nd].custom?.context ?? {}
      Object.keys(ctx).forEach(prop => {
        actions.setProp(nd, (props) => props[prop] = metadata.context[prop])
      })
    })
    setPreviousNodes(JSON.parse(query.serialize()))
  }

  useEffect(() => {
    if (selectedNodeId) publish("zoomToNode", { id: selectedNodeId })
  }, [selectedNodeId])

  // udpate state based on topics
  useVisualUiComms({ actions, query }, { resolveComponentsDir, appendNewNodeToTree }, setPreviousNodes, data['flow/editor'], contextAtom, metadata.context)

  useEffect(() => {
    actions.setOptions(options => options['skipTopic'] = false)
  }, [previousNodes])

  useKeypress(['z', 'Z', 's', 'S', 'c', 'C', 'Delete', 'Backspace'], (event) => {
    const isEditorVisible = paper.current?.getBoundingClientRect()?.height > 0
    if (!isEditorVisible) return
    if ((event.key == "z" || event.key == "Z") && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      try {
        actions.history.redo()
      } catch (e) { console.error('can not redone action') }
      return
    } else if ((event.key == "z" || event.key == "Z") && (event.ctrlKey || event.metaKey)) { // Undone
      try {
        actions.history.undo()
      } catch (e) { console.error('can not undone action') }
      return
    }
  });

  useEffect(() => {
    const reload = async (retry: number) => {
      try {
        await loadEditorNodes(currentPageContent)
      } catch (e) {
        if (retry < 10) {
          setTimeout(() => reload(retry + 1), 5000)
          setLoading(true)
        } else {
          console.error(`Max retry reached! Error deserializing editor nodes (CraftJS nodes). Error: ${e}`)
        }
        console.error(`Error deserializing editor nodes (CraftJS nodes). Error: ${e}`)
      }
    }
    if (currentPageContent) {
      setLoading(false)
      reload(0)
    }
  }, [currentPageContent])

  useUpdateEffect(() => {
    updatesPropsWithContext()
  }, [metadata.context])

  return (
    <div style={{
      backgroundColor: "rgb(50, 50, 50)",
      overflow: "hidden",
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }}>
      <Head>
        <title>Platform UI</title>
        <link rel="icon" type="image/png" sizes="16x16" href={require("../assets/logo.png")}></link>
      </Head>
      {loading ? <Stack style={{ height: '100vh', justifyContent: 'center', alignItems: 'center', zIndex: 100, backgroundColor: '#f0f0f0' }}>
        <Spinner size="large"></Spinner>
      </Stack> : null}
      <div
        onLoad={() => setLoading(false)}
        className={"page-container"}
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'auto', overflowX: 'hidden' }}
      >
        <div
          id="editor"
          className={"craftjs-renderer"}
          ref={(ref) => { paper.current = ref; connectors.select(connectors.hover(ref, null), null) }}
          style={{
            flex: 1, position: 'relative', overflow: 'auto',
            color: 'black', backgroundColor: '#f0f0f0', margin: '0 auto',
            left: 0, right: 0,
            width: frames[frame]?.width ?? '100%',
            height: frames[frame]?.height ?? '100%',
            marginTop: frames[frame]?.marginTop ?? ''
          }}
        >
          <ErrorBoundary>
            <div id="editor-frame-container">
              <Frame />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default withTopics(Editor, { topics: ['flow/editor'] });