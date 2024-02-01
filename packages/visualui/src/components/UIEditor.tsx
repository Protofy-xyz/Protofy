import { memo, useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { Editor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import { RenderNode } from './RenderNode';
import paletteComponents from '../palettes';
import EditorLayout from "./EditorLayout";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "protolib";
import Monaco from "./Monaco";
import { Component, X, Workflow, SlidersHorizontal, Code, Layers as Layers3, Pencil, Save, ChevronRight } from "lucide-react";
import { getMissingJsxImports, getSource } from "../utils/utils";
import theme from './Theme'
import { withTopics } from "react-topics";
import { ToggleGroup, Button, XStack } from "@my/ui"
import { SidebarItem } from "./Sidebar/SideBarItem";
import { getFlowMasks, getFlowsCustomComponents } from "app/bundles/masks";
import { FlowConstructor } from "protoflow";
import React from "react";

export const UIFLOWID = "flows-ui"
const Flow = FlowConstructor(UIFLOWID)

const FloatingIcon = ({ id = undefined, children, onClick, disabled = false }) => <div id={id} onClick={disabled ? () => null : onClick} style={{ marginBottom: 20, backgroundColor: 'black', opacity: disabled ? 0.2 : 1, borderRadius: '100%', justifyContent: 'center', alignItems: 'center', width: '40px', height: '40px', display: 'flex', cursor: 'pointer' }}>
    {children}
</div>

/* 
// const uiStore = useFlowsStore()
*/
function UIEditor({ isActive = true, sourceCode = "", sendMessage, currentPage = "", userPalettes = {}, resolveComponentsDir = "", topics, metadata = {} }) {
    const editorRef = useRef<any>()
    const [codeEditorVisible, setCodeEditorVisible] = useState(false)
    const [currentPageContent, setCurrentPageContent] = useState("")
    const [monacoSourceCode, setMonacoSourceCode] = useState(currentPageContent)
    const [monacoHasChanges, setMonacoHasChanges] = useState(false)
    const [preview, setPreview] = useState(true)
    const [isSideBarVisible, setIsSideBarVisible] = useState(false)
    const [customizeVisible, setCustomizeVisible] = useState(true);
    const [layerVisible, setLayerVisible] = useState(false);
    const router = useRouter();
    const { publish } = topics;
    const { data } = topics;
    const [openPanel, setOpenPanel] = React.useState(false);

    useEffect(() => {
        const handleClosePanel = () => setOpenPanel(false)
        window.addEventListener('dragenter', handleClosePanel)
        return () => {
            window.removeEventListener('dragenter', handleClosePanel)
        }
    }, [])

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
                sendMessage({ type: 'save', data: { content } })
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
                        if (!moduleSpecifier) {
                            impText = ""
                        }
                        else if (impData.namedImports?.length) { // is named import
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
        }
    }
    const onMonacoChange = (code) => {
        setMonacoSourceCode(code)
        if (currentPageContent != code) setMonacoHasChanges(true)
        else setMonacoHasChanges(false)
    }
    const onCancelMonaco = () => {
        setMonacoSourceCode(currentPageContent)
        setMonacoHasChanges(false)
    }

    useEffect(() => {
        setMonacoSourceCode(currentPageContent)
    }, [currentPageContent])

    useEffect(() => {
        loadPage()
    }, [sourceCode]);

    useEffect(() => {
        if (data['zoomToNode']?.id && !isSideBarVisible) {
            setIsSideBarVisible(true)
        }
    }, [data['zoomToNode']])
    const FlowPanel = (
        <div
            key="auxiliarySidebar"
            // FIX: Make disapear panel div while not visible, can't hide it from first render with display: isSidebarVisible ? 'flex':'none'
            style={{ display: 'flex', width: '100%', top: isSideBarVisible ? 0 : -1000000000000, position: isSideBarVisible ? 'relative' : 'absolute', height: '100%' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 9999999999999, backgroundColor: '#252526', borderBottom: '1px solid #cccccc20' }}>
                    <XStack theme="dark">
                        <Button
                            onPress={(e) => { setIsSideBarVisible(false); setCodeEditorVisible(false); e.stopPropagation() }}
                            hoverStyle={{ opacity: 1 }} opacity={0.7}
                            size="$3"
                            chromeless
                            circular
                            noTextWrap
                        >
                            <ChevronRight fillOpacity={0} style={{ alignSelf: 'center' }} opacity={0.5} color="var(--color)" />
                        </Button>
                    </XStack>
                    <XStack display={monacoHasChanges ? 'flex' : 'none'} theme={"dark"} marginVertical="$1">
                        <Button size="$3" chromeless circular marginRight="$2" onPress={onCancelMonaco}>
                            <X />
                        </Button>
                        <Button size="$3" chromeless circular onPress={() => onEditorSave("monaco", monacoSourceCode)}>
                            <Save fillOpacity={0} />
                        </Button>
                    </XStack>
                    <ToggleGroup display={monacoHasChanges ? 'none' : 'flex'} theme={"dark"} type="single" defaultValue="preview" disableDeactivation>
                        <ToggleGroup.Item value="code" onPress={() => { setPreview(false); setCodeEditorVisible(true) }}>
                            <Code />
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="flow" onPress={() => { setPreview(false); setCodeEditorVisible(false) }}>
                            <Workflow />
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="preview" onPress={() => { setPreview(true); setCodeEditorVisible(false) }}>
                            <SlidersHorizontal />
                        </ToggleGroup.Item>
                    </ToggleGroup>
                </div>
                <div style={{ display: codeEditorVisible ? 'flex' : 'none', flex: 1 }}>
                    <Monaco
                        onChange={onMonacoChange}
                        sourceCode={monacoSourceCode}
                    />
                </div>
                <div style={{ opacity: 1, marginRight: 0, flex: 1, display: codeEditorVisible ? 'none' : 'flex', flexDirection: 'column', backgroundColor: '#252526' }}>
                    <SidebarItem
                        icon={Pencil}
                        title="Customize"
                        height={!layerVisible ? 'full' : '55%'}
                        visible={customizeVisible}
                        onChange={(val) => setCustomizeVisible(val)}
                    >
                        <Flow
                            disableDots={!isActive || preview}
                            sourceCode={currentPageContent}
                            setSourceCode={setCurrentPageContent}
                            customComponents={getFlowsCustomComponents(router.pathname, router.query)}
                            onSave={(code, _, data) => onEditorSave('flows', code, data)}
                            enableCommunicationInterface={true}
                            // store={uiStore}
                            config={{ masks: getFlowMasks(router.pathname, router.query) }}
                            zoomOnDoubleClick={!preview}
                            flowId={UIFLOWID}
                            themeMode={'dark'}
                            bgColor={'#252526'}
                            theme={theme}
                            nodePreview={preview}
                            metadata={metadata}
                        />
                    </SidebarItem>
                    <SidebarItem
                        icon={Layers3}
                        title="Layers"
                        visible={layerVisible}
                        onChange={(val) => setLayerVisible(val)}
                        height={!customizeVisible ? 'full' : '55%'}
                    >
                        <Layers />
                    </SidebarItem>
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

    const onCancelEdit = () => {
        router.push({
            query: {}
        })
    }

    const actionContent = (
        <>
            <FloatingIcon id="components-to-drag-btn" onClick={() => setOpenPanel(true)}>
                <Component
                    color="white"
                />
            </FloatingIcon>
            <FloatingIcon
                id="save-nodes-btn"
                onClick={() => publish("savenodes", { value: 'visual-ui' })}
            >
                <Save
                    color="white"
                />
            </FloatingIcon>
            <FloatingIcon
                onClick={onCancelEdit}
            >
                <X color="white"></X>
            </FloatingIcon>
        </>
    )
    const EditorPanel = (
        <div id="editor-layout" style={{ flex: 1, display: 'flex', minWidth: "280px", borderRight: '2px solid #424242', borderLeft: '2px solid #424242' }}>
            <EditorLayout currentPageContent={currentPageContent} onSave={() => null} resolveComponentsDir={resolveComponentsDir}>
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
                    openPanel={openPanel}
                    setOpenPanel={setOpenPanel}
                    actionContent={actionContent}
                    leftPanelContent={SidebarPanel}
                    centerPanelContent={EditorPanel}
                    rightPanelContent={FlowPanel}
                    rightPanelResizable={!preview}
                    rightPanelWidth={!preview?50:0}
                    rightPanelVisible={isSideBarVisible}
                />
            </div>
        </Editor>
    </div>

}

export default memo(withTopics(UIEditor, { topics: ['zoomToNode'] }));