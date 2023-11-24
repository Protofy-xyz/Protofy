import React, { useRef, useState, useEffect } from "react";
import Head from 'next/head'
import { Frame, useEditor } from "@craftjs/core";
import { useEditorStore } from "../store/EditorStore";
import useKeypress from 'react-use-keypress';
import Diff from 'deep-diff'
import Source from "../models/Source";
import { withTopics } from "react-topics";
import { ErrorBoundary } from 'react-error-boundary'
import { JSCodeToOBJ } from "../utils/utils";
import { notify, computePreviousPositions } from "../utils/utils";
import { Stack, Spinner, Text, YStack } from "@my/ui"

export type EditorProps = {
	children?: any;
	onSave: Function;
	topics: any;
	resolveComponentsDir: string;
};


const Editor = ({ children, topics, onSave, resolveComponentsDir }: EditorProps) => {
	const paper = useRef<any>()
	const currentPageContent = useEditorStore(state => state.currentPageContent)
	const currentPageInitialJson = useEditorStore(state => state.currentPageInitialJson)
	const setCurrentPageInitialJson = useEditorStore(state => state.setCurrentPageInitialJson)
	const [loading, setLoading] = useState(false);
	const [missingElements, setMissingElements] = useState("");
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
				const newNodeId = nodesChanges.find(d => d.kind == 'N').path[0]
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
				if (children_diff) { // edited child text
					const nodeId = children_diff.path[0]
					const newChildValue = children_diff.rhs
					topicParams = {
						action: 'edit-node',
						nodeId: nodeId,
						newChildValue: newChildValue
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
					const move_diff = nodesChanges.find(d => d.kind == 'E' && d.path[1] == "nodes");
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
	useEffect(() => {
		if (selectedNodeId) publish("zoomToNode", { id: selectedNodeId })
	}, [selectedNodeId])

	useEffect(() => {
		const flowData = data['flow/editor']
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
					let val = value;
					try {
						val = JSON.parse(val)
					} catch (e) { }
					actions.setProp(nodeId, (props) => props[modifiedKey] = val)
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
	}, [data['flow/editor']])
	useEffect(() => {
		actions.setOptions(options => options['skipTopic'] = false)
	}, [previousNodes])

	const loadEditorNodes = async () => {
		const source: Source = Source.parse(currentPageContent)
		let editorNodes = source.data()
		setCurrentPageInitialJson(editorNodes)
		setMissingElements("")
		try {
			Object.keys(editorNodes).forEach((nk: any) => Object.keys(editorNodes[nk].props).forEach((pk: any) => {
				const props = editorNodes[nk].props
				const propContent = props[pk]
				if (propContent.startsWith('{') && propContent.endsWith('}')) {
					const code = propContent.substring(1, propContent.length - 1)
					try {
						JSCodeToOBJ(code)
					} catch (e) {
						if (e.name == 'SyntaxError') {
							props[pk] = ''
						}
					}
				}
			}))
			actions.deserialize(editorNodes)
		} catch (e) {
			const availableComponents = query?.getOptions()?.resolver ?? {} 
			const availableCompArr = Object.keys(availableComponents)
			const missingElements = Object.keys(editorNodes)?.filter(i => !availableCompArr.includes(editorNodes[i].displayName))
			const missingComponents = missingElements.map(i => editorNodes[i]?.displayName)?.join(', ')
			setMissingElements(missingComponents)
			throw "Error loading editor nodes"
		}
	}

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
				await loadEditorNodes()
				setLoading(false)
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
			reload(0)
		}
	}, [currentPageContent])

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
			<div
				className={"page-container"}
				style={{ width: '100%', height: '100%' }}
			>
				<div
					id="editor"
					className={"craftjs-renderer"}
					ref={(ref) => { paper.current = ref; connectors.select(connectors.hover(ref, null), null) }}
					style={{ flex: 1, position: 'relative', overflow: 'auto', color: 'black', backgroundColor: '#f0f0f0', margin: '0 auto', left: 0, right: 0, width: '100%', height: '100%' }}
				>
					{
						loading ?
							<Stack style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
								{missingElements ? <YStack width={"80%"} maxWidth={'600px'} alignItems="center">
									<Text color='red'>
										Can not load the following elements:
									</Text>
									<Text marginTop='10px'>
										{missingElements}
									</Text>
								</YStack> : <div>
									<Spinner size="large" marginBottom="20px"></Spinner>
									<div>
										Loading Content...
									</div>
								</div>}
							</Stack>
							:
							<ErrorBoundary FallbackComponent={<div style={{ margin: '20px' }}>There seems to be an error in your page preventing the editor from loading it. Please check the code and fix the errors. </div> as any}>
								<Frame />
							</ErrorBoundary>
					}
				</div>
			</div>
		</div>
	);
};

export default withTopics(Editor, { topics: ['flow/editor'] });