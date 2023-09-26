import React, { memo, useEffect, useState, useRef } from "react";
import { Editor } from "@craftjs/core";
import { useEditorStore } from '../store/EditorStore';
import { RenderNode } from './RenderNode';
import paletteComponents from '../palettes';
import EditorLayout from "./EditorLayout";
import { Sidebar } from "./Sidebar";
import SlidingPanel from "./SlidingPanel";
import Monaco from "./Monaco";
import { X, Save } from "lucide-react";
import { FlowFactory, useFlowsStore } from 'protoflow';
import { getMissingJsxImports, getSource } from "../utils/utils";
import theme from './Theme'

export const UIFLOWID = "flows-ui"
const Flow = FlowFactory(UIFLOWID)
const uiStore = useFlowsStore()

function UIEditor({ isActive = true, sourceCode = "", pages = [], sendMessage, currentPage = "", userComponents = {}, resolveComponentsDir = "" }) {

    const editorRef = useRef()
    const [codeEditorVisible, setCodeEditorVisible] = useState(false)
    const currentPageContent = useEditorStore(state => state.currentPageContent)
    const setCurrentPageContent = useEditorStore(state => state.setCurrentPageContent)
    const [monacoSourceCode, setMonacoSourceCode] = useState(currentPageContent)

    // const allPalettes = { ...paletteComponents, ...userPalettes }
    const allPalettes = { ...paletteComponents, ...userComponents }
    const getCraftComponents = (enableDropable?: boolean) => { // FIX: If components of diferent palette has the same name will overwrite
        let filteredPalettes = Object.keys(allPalettes)
        if (enableDropable) {
            filteredPalettes = filteredPalettes.filter(key => key != 'craft')
        }
        return filteredPalettes.reduce((total, paletteName) => total = { ...total, ...allPalettes[paletteName] }, {})
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
                const missingJsxImports = getMissingJsxImports(data.nodes, data.nodesData, resolveComponentsDir)
                if (missingJsxImports.length) {
                    const missingJsxImportsText = missingJsxImports.reduce((total, impData) => {
                        let impText;
                        let moduleSpecifier = impData.moduleSpecifier;
                        if (impData.namedImports?.length) { // is named import
                            const namedImportName = impData.namedImports[0]?.alias
                                ? (impData.namedImports[0]?.name + " as " + impData.namedImports[0]?.alias)
                                : impData.namedImports[0]?.name;
                            impText = "import {" + namedImportName + '} from "' + moduleSpecifier + '";\n'
                        }
                        else if (impData.defaultImport) { // is default import
                            impText = "import " + impData.defaultImport + ' from "' + moduleSpecifier + '";\n'
                        }
                        return total + impText
                    }, '\n')
                    const lastImportPos = previousImports ? previousImports[previousImports.length - 1].getEnd() : 0
                    const newAstContent = astContent.insertText(lastImportPos, missingJsxImportsText)
                    content = newAstContent.getText()
                }
                sendMessage({ type: 'save', data: { content } })
                break;
            case "editor":
                break;
        }
    }

    useEffect(() => {
        setMonacoSourceCode(currentPageContent)
    }, [currentPageContent])

    useEffect(() => {
        loadPage()
    }, [sourceCode]);

    const FlowPanel = (
        <div
            key="auxiliarySidebar"
            style={{ width: '100%', display: 'flex', flex: 1 }}
        >
            {
                codeEditorVisible
                    ? <>
                        <div style={{ position: 'absolute', zIndex: 100, marginLeft: '-50px', marginTop: '20px' }}>
                            <div onClick={() => setCodeEditorVisible(false)} style={{ display: 'flex', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X color={'white'} size={25} />
                            </div>
                            <div onClick={() => onEditorSave("monaco", monacoSourceCode)} style={{ display: 'flex', backgroundColor: '#252526', borderRadius: '14px', width: '40px', padding: '5px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '10px' }}>
                                <Save color={'white'} size={25} />
                            </div>
                        </div>
                        <Monaco
                            onEscape={() => setCodeEditorVisible(false)}
                            onSave={() => onEditorSave("monaco", monacoSourceCode)}
                            onChange={setMonacoSourceCode}
                            sourceCode={monacoSourceCode}
                        />
                    </>
                    : <></>
            }
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
                    themeMode={'dark'}
                    bgColor={'#252526'}
                    theme={theme}
                />
            </div>
        </div>
    )
    const SidebarPanel = (
        <div
            key="sidebar"
            style={{ display: 'flex', flex: 1, maxWidth: '290px' }}
        >
            <Sidebar
                palettes={allPalettes}
                pages={pages}
                sendMessage={sendMessage}
                currentPage={currentPage}
            />
        </div>
    );
    const EditorPanel = (
        <div style={{ flex: 1, display: 'flex', minWidth: "280px", borderRight: '2px solid #424242', borderLeft: '2px solid #424242' }}>
            <EditorLayout onSave={() => null} resolveComponentsDir={resolveComponentsDir}>
            </EditorLayout>
        </div>
    )
    function handleResize(e = {} as any) {
        const viewportHeight = window.innerHeight;
        if (!editorRef.current) return
        editorRef.current.style.height = viewportHeight + 'px'
    }
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    }, [])


    return <div ref={editorRef} style={{ display: 'flex', flex: 1, width: '100%' }}>
        <Editor
            resolver={availableCraftComponents}
            onRender={RenderNode}
        >
            <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <SlidingPanel
                    leftPanelContent={SidebarPanel}
                    centerPanelContent={EditorPanel}
                    rightPanelContent={FlowPanel}
                />
            </div>
        </Editor>
    </div>

}

export default memo(UIEditor);