'use client'
import React, { memo, useEffect, useState } from "react";
import { Editor } from "@craftjs/core";
import { useEditorStore } from '../../store/EditorStore';
// import { NativeBaseProvider, extendTheme } from "native-base";
// import systemTheme from "baseapp/core/themes/protofyTheme";
// import Modules from 'internalapp/generated/visualui/modules';
// import userPalettes from 'internalapp/generated/visualui/palettes';
// import { RenderNode } from './RenderNode';
import paletteComponents from '../../palettes';
// import PaletteLoader from "visualui/components/loaders/PaletteLoader";
import EditorComponent from "./editor";
import { Sidebar } from "./sidebar";
// import { AuxiliaryBar } from "./auxiliary-bar";
import Monaco from "../Monaco";
import { FlowFactory, useFlowsStore } from 'protoflow';
import EditorApi from "../../api/EditorApi";
// import { BaseJSMasks } from '../flowslib';
import SlidingPanel from "../flows/resizableSidebar/SlidingPanel";
// import toggles from "../../utils/toggles";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TiFlowMerge } from "react-icons/ti"
import { getMissingJsxImports, getSource } from "../../utils/utils";
// import UIMasks from '../flows/masks/UI.mask.json'

export const UIFLOWID = "flows-ui"

const Flow = FlowFactory(UIFLOWID)
const uiStore = useFlowsStore()

function UIEditor({ isActive = true, sourceCode = "", onSave = (content) => {}, pages = [], sendMessage, currentPage, userComponents }) {

	const [codeEditorVisible, setCodeEditorVisible] = useState(false)
	const currentPageContent = useEditorStore(state => state.currentPageContent)
	const setCurrentPageContent = useEditorStore(state => state.setCurrentPageContent)
	const [monacoSourceCode, setMonacoSourceCode] = useState(currentPageContent)

	// const allPalletes = { ...paletteComponents, ...userPalettes }
	const allPalletes = { ...paletteComponents, project: userComponents }
	const getCraftComponents = (enableDropable?: boolean) => { // FIX: If components of diferent palette has the same name will overwrite
		let filteredPalettes = Object.keys(allPalletes)
		if (enableDropable) {
			filteredPalettes = filteredPalettes.filter(key => key != 'craft')
		}
		return filteredPalettes.reduce((total, paletteName) => total = { ...total, ...allPalletes[paletteName] }, {})
	}
	const mergedPaletteComponents = getCraftComponents()
	// const availableCraftComponents = { ...mergedPaletteComponents, ...Modules[currentPage] }
	const availableCraftComponents = { ...mergedPaletteComponents }

	const loadPage = async () => {
		setCurrentPageContent(sourceCode)
	}

	const onEditorSave = async (triggerer: "monaco" | "flows" | "editor", code?, data?) => {
		var content = code
		switch (triggerer) {
			case "monaco":
				content = monacoSourceCode
				break;
			case "flows":
				if (!data) break
				const astContent = getSource(content)
				const previousImports = astContent.getImportDeclarations();
				const missingJsxImports = getMissingJsxImports(data.nodes, data.nodesData)
				if (missingJsxImports.length) {
					const missingJsxImportsText = missingJsxImports.reduce((total, impData) => {
						const impText = "import " + impData.name + ' from "' + impData.module + '";\n'
						return total + impText

					}, '\n')
					const lastImportPos = previousImports ? previousImports[previousImports.length - 1].getEnd() : 0
					const newAstContent = astContent.insertText(lastImportPos, missingJsxImportsText)
					content = newAstContent.getText()
				}
				onSave(content)
				break;
			case "editor":
				break;
		}
		// const newContent: string = await EditorApi.updatePageContent(currentPage, content)
		// if (!newContent) return
		// setCurrentPageContent(newContent)
	}
	// useEffect(() => {
	// 	addInitialQueries()
	// 	listPages()
	// }, [])
	useEffect(() => {
		setMonacoSourceCode(currentPageContent)
	}, [currentPageContent])

	useEffect(() => {
		loadPage()
	}, [sourceCode]);

	const auxiliaryFlow = (
		<div
			key="auxiliarySidebar"
			style={{ width: '100%', display: 'flex', flex: 1 }}
		>
			{codeEditorVisible
				? <>
					<div style={{ position: 'absolute', zIndex: 100, marginLeft: '-50px', marginTop: '20px' }}>
						<div onClick={() => setCodeEditorVisible(false)} style={{ display: 'flex', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
							<TiFlowMerge color={'white'} size={25} />
						</div>
						<div onClick={() => onEditorSave("monaco", monacoSourceCode)} style={{ display: 'flex', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '10px' }}>
							<TiFlowMerge color={'red'} size={25} />
						</div>
					</div>
					<Monaco onEscape={() => setCodeEditorVisible(false)} onSave={() => onEditorSave("monaco", monacoSourceCode)} onChange={setMonacoSourceCode} sourceCode={monacoSourceCode} />
				</>
				: <></>}
			<div style={{ display: !codeEditorVisible ? 'flex' : 'none', width: '100%' }}>
				<Flow
					disableDots={!isActive}
					sourceCode={currentPageContent}
					setSourceCode={setCurrentPageContent}
					customComponents={[]}
					onSave={(code, _, data) => onEditorSave('flows', code, data)}
					onShowCode={() => setCodeEditorVisible(true)}
					enableCommunicationInterface={true}
					store={uiStore}
					// config={{masks: UIMasks}}
					flowId={UIFLOWID}
					showActionsBar
				/>
			</div>
		</div>
	)
	const sidebar = (
		<div
			key="sidebar"
			style={{ display: 'flex', flex: 1, maxWidth: '290px', border: '1px solid #424242' }}
		>
			<Sidebar
				palettes={allPalletes}
				pages={pages}
				sendMessage={sendMessage}
				currentPage={currentPage}
			/>
		</div>
	);
	const editorContent = (
		<div style={{ flex: 1, display: 'flex', minWidth: "280px", border: '1px solid #424242' }}>
			<EditorComponent onSave={() => null}>
			</EditorComponent>
		</div>
	)
	return <div style={{ display: 'flex', flex: 1, width: '100%' }}>
		<Editor
			resolver={availableCraftComponents}
		>
			<div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
				<SlidingPanel leftPanelContent={sidebar} centerPanelContent={editorContent} rightPanelContent={auxiliaryFlow} />
			</div>
		</Editor>
	</div>

}

export default memo(UIEditor);