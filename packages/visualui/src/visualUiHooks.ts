import { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { EditorStore, useEditorContext } from "@protocraft/core";
import { useRouter } from 'next/router'

// create craftjs context 
export function newVisualUiContext(options: any) {
  return useEditorContext(options)
}

// handle no contextAtom provided on UIEditor()
export function useVisualUiAtom(_atom: any) {
  const contextAtom = _atom ?? null
  return contextAtom ? useAtom(contextAtom) : [null, null]
}

// hook for visualUiState management
export function useVisualUi(atom, callb, defState) {
  const [state, setState] = useState(defState)
  const [lastEvent, setLastEvent] = useState<any>(null)
  const [craftContext] = useAtom<EditorStore>(atom)

  useEffect(() => {
    if (!craftContext || !craftContext['subscribe']) return

    craftContext.subscribe(
      (_) => {
        setState((prev: any) => {
          const result = callb(prev, craftContext)
          return result ?? prev
        })
      },
      () => {
        // we need to discover more about this callback
      }
    );
  }, [craftContext])

  useEffect(() => {
    console.log('boyyyy')
  }, [craftContext.query.serialize()])

  return {
    state: state,
    visualUiData: craftContext,
    lastEvent: lastEvent
  }
}

// toggle communication mode visualUi
export function useVisualUiComms({ actions, query }, { resolveComponentsDir, appendNewNodeToTree }, setPreviousNodes, topicData) {
    const router = useRouter()
    const queryParams = router.query

    if (queryParams.experimental_comms === 'true') {
        useEffect(() => {
            console.log('experimental communications')
        }, [])
    } else {
        useEffect(() => {
            const flowData = topicData
            const action = flowData.action
            const nodeId = flowData.nodeId;
            const value = flowData.value;
            const modifiedKey = flowData.param;
        
            switch (action) {
              case 'delete-node':
                if (flowData.deletedNodeType != "JsxElement") return
                actions.setOptions(options => options['skipTopic'] = true)
                flowData.nodesToDelete?.forEach(nId => actions.delete(nId))
                setPreviousNodes(JSON.parse(query.serialize()));
                break;
              case 'delete-data':
                if (!modifiedKey) return
                try {
                  actions.setOptions(options => options['skipTopic'] = true)
                  actions.setProp(nodeId, (props) => {
                    delete props[modifiedKey]
                    return props
                  })
                  setPreviousNodes(JSON.parse(query.serialize()));
                } catch (e) {
                  console.error('error deleting data. ', e)
                }
                break;
              case 'edit-data': // modify existing node prop/child
                if (!modifiedKey) return
                try {
                  actions.setOptions(options => options['skipTopic'] = true)
                  actions.setProp(nodeId, (props) => props[modifiedKey] = value)
                  actions.setCustom(nodeId, (custom) => custom[modifiedKey] = "JsxText")
                  const deleteKey = flowData?.deleteKey
                  if (deleteKey) {
                    actions.setProp(nodeId, (props) => {
                      delete props[deleteKey]
                      return props
                    })
                  }
                  setPreviousNodes(JSON.parse(query.serialize()));
                } catch (e) {
                  console.error('error editing data. ', e)
                }
                break;
              case 'add-data': // modify existing node adding new prop/child
                let newNodes = JSON.parse(query.serialize())
                if (!newNodes[nodeId]) return
                try {
                  newNodes[nodeId] = { ...newNodes[nodeId], props: { ...newNodes[nodeId].props, [modifiedKey]: value } }
                  actions.setOptions(options => options['skipTopic'] = true)
                  actions.setProp(nodeId, (props) => props[modifiedKey] = value)
                  setPreviousNodes(newNodes);
                } catch (e) {
                  console.error('error adding data. ', e)
                }
                break;
              case 'add-node':
                const type = flowData.type
                const childrenIndex = flowData.childrenPos;
                const name = flowData.nodeName;
                const parentId = flowData.parent;
                if (type == "JsxElement") { // Is a new component
                  const newCraftNodeData = {
                    displayName: name,
                    props: {},
                    custom: {
                      defaultImport: name,
                      moduleSpecifier: `"${resolveComponentsDir}${name}"`,
                      _nodeType: "JsxElement"
                    },
                    hidden: false,
                    isCanvas: true,
                    parent: parentId,
                    type: {
                      resolvedName: name
                    },
                    nodes: []
                  }
                  const prevNodes = JSON.parse(query.serialize());
                  if (!parentId || !prevNodes) return
                  try {
                    const newTree = appendNewNodeToTree(prevNodes, nodeId, newCraftNodeData, parentId, childrenIndex)
                    actions.setOptions(options => options['skipTopic'] = true)
                    actions.deserialize(newTree);
                    setPreviousNodes(JSON.parse(query.serialize()));
                  } catch (e) {
                    console.error('error adding node (JsxElement). ', e)
                  }
                } else { // is a prop of a component
                  try {
                    const newPropData = flowData.data;
                    if (!newPropData?.isAncestorJsxElement) return
                    actions.setOptions(options => options['skipTopic'] = true)
                    actions.setProp(parentId, (props) => props[newPropData.key] = newPropData.value)
                    setPreviousNodes(JSON.parse(query.serialize()));
                  } catch (e) {
                    console.error('error adding node (Not a JsxElement). ', e)
                  }
                }
                break;
              default:
                break;
            }
        }, [topicData])
    }

}
