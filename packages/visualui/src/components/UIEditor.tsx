import { memo, useEffect, useState, useRef } from "react";
import { Editor } from "@craftjs/core";
import { useEditorStore } from '../store/EditorStore';
import { RenderNode } from './RenderNode';
import paletteComponents from '../palettes';
import EditorLayout from "./EditorLayout";
import { Sidebar } from "./Sidebar";
import MainPanel from "./MainPanel";
import Monaco from "./Monaco";
import { X, Workflow, SlidersHorizontal, Code } from "lucide-react";
import { FlowFactory } from 'protoflow';
import { getMissingJsxImports, getSource } from "../utils/utils";
import theme from './Theme'
import { withTopics } from "react-topics";
import { ToggleGroup, Button } from "@my/ui"

export const UIFLOWID = "flows-ui"
const Flow = FlowFactory(UIFLOWID)
// const uiStore = useFlowsStore()

function UIEditor({ isActive = true, sourceCode = "", sendMessage, currentPage = "", userPalettes = {}, resolveComponentsDir = "", topics }) {

    const editorRef = useRef<any>()
    const [codeEditorVisible, setCodeEditorVisible] = useState(false)
    const currentPageContent = useEditorStore(state => state.currentPageContent)
    const setCurrentPageContent = useEditorStore(state => state.setCurrentPageContent)
    const [monacoSourceCode, setMonacoSourceCode] = useState(currentPageContent)
    const [preview, setPreview] = useState(true)
    const [isSideBarVisible, setIsSideBarVisible] = useState(false)
    const [pastZoomNodes, setPastZoomNodes] = useState([])

    const { data } = topics;

    const allPalettes = { ...paletteComponents, ...userPalettes }

    const getCraftComponents = (enableDropable?: boolean) => { // FIX: If components of diferent palette has the same name will overwrite
        let filteredPalettes = Object.keys(allPalettes)
        if (enableDropable) {
            filteredPalettes = filteredPalettes.filter(key => key != 'craft')
        }
        return filteredPalettes.reduce((total, paletteName) => total = { ...total, ...allPalettes[paletteName] }, {})
    }
    const availableCraftComponents = getCraftComponents()

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
    useEffect(() => {
        if (data['zoomToNode']?.id) {
            if (!isSideBarVisible) {
                setIsSideBarVisible(true)
            }
            if (pastZoomNodes[0] == data['zoomToNode'].id) return
            pastZoomNodes[0] = data['zoomToNode'].id
            setPastZoomNodes([...pastZoomNodes])
        }
    }, [data['zoomToNode']])
    const FlowPanel = (
        <div
            key="auxiliarySidebar"
            style={{ width: '100%', display: 'flex', flex: 1, height: '100%' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 9999999999999, backgroundColor: '#252526', borderBottom: '1px solid #cccccc20' }}>
                    <div style={{ color: preview ? 'white' : 'transparent' }}>{pastZoomNodes[0]}</div>
                    <div style={{ display: 'flex' }}>
                        <ToggleGroup type="single" defaultValue="preview" disableDeactivation>
                            <ToggleGroup.Item value="code" onPress={() => setCodeEditorVisible(true)} >
                                <Code />
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="flow" onPress={() => { setPreview(false); setCodeEditorVisible(false) }}>
                                <Workflow />
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="preview" onPress={() => { setPreview(true); setCodeEditorVisible(false) }}>
                                <SlidersHorizontal />
                            </ToggleGroup.Item>
                        </ToggleGroup>
                        <Button
                            onPress={(e) => { setIsSideBarVisible(false); setCodeEditorVisible(false); e.stopPropagation() }}
                            hoverStyle={{ opacity: 1 }} opacity={0.7}
                            size="$3"
                            chromeless
                            circular
                            noTextWrap
                        >
                            <X style={{ alignSelf: 'center' }} opacity={0.5} color="var(--color)" />
                        </Button>
                    </div>
                </div>

                <div style={{ display: codeEditorVisible ? 'flex' : 'none', flex: 1 }}>
                    <Monaco
                        onEscape={() => setCodeEditorVisible(false)}
                        onSave={() => onEditorSave("monaco", monacoSourceCode)}
                        onChange={setMonacoSourceCode}
                        sourceCode={monacoSourceCode}
                    />
                </div>
                <div style={{ display: !codeEditorVisible ? 'flex' : 'none', flex: 1 }}>
                    <Flow
                        disableDots={!isActive || preview}
                        sourceCode={currentPageContent}
                        setSourceCode={setCurrentPageContent}
                        customComponents={[]}
                        onSave={(code, _, data) => onEditorSave('flows', code, data)}
                        enableCommunicationInterface={true}
                        // store={uiStore}
                        // config={{masks: UIMasks}}
                        flowId={UIFLOWID}
                        showActionsBar={!preview}
                        themeMode={'dark'}
                        bgColor={'#252526'}
                        theme={theme}
                        nodePreview={preview}
                    />
                </div>
            </div>
        </div >
    )
    const SidebarPanel = (
        <div
            key="sidebar"
            style={{ display: 'flex', flex: 1, height: '100%' }}
        >
            <Sidebar
                palettes={allPalettes}
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
                <MainPanel
                    leftPanelContent={SidebarPanel}
                    centerPanelContent={EditorPanel}
                    rightPanelContent={FlowPanel}
                    rightPanelResizable={!preview}
                    rightPanelVisible={isSideBarVisible}
                />
            </div>
        </Editor>
    </div>

}

export default memo(withTopics(UIEditor, { topics: ['zoomToNode'] }));