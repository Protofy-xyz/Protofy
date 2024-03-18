import { memo, useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { Editor } from "@protocraft/core";
import { Layers } from "@protocraft/layers";
import { RenderNode } from './RenderNode';
import paletteComponents from '../palettes';
import EditorLayout from "./EditorLayout";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "protolib";
import Monaco from "./Monaco";
import { Component, LogOut, Network, Workflow, SlidersHorizontal, Code, Layers as Layers3, Pencil, Save, X, PanelRight, Monitor, Tablet, Smartphone, SunMoon, Sun, Moon } from "lucide-react";
import { getMissingJsxImports, getSource } from "../utils/utils";
import Theme, { useUITheme } from './Theme'
import { withTopics } from "react-topics";
import { ToggleGroup, Button, XStack } from "@my/ui"
import { SidebarItem } from "./Sidebar/SideBarItem";
import { getFlowMasks, getFlowsCustomComponents } from "app/bundles/masks";
import React from "react";
import { newVisualUiContext, useVisualUiAtom } from "../visualUiHooks";
import { VisualUiFlows } from "./VisualUiFlows";
import EditorBar from "./EditorBar";
import { useThemeSetting } from '@tamagui/next-theme'

function UIEditor({ isActive = true, sourceCode = "", sendMessage, currentPage = "", userPalettes = {}, resolveComponentsDir = "", topics, metadata = {}, contextAtom = null }) {
    const [_, setContext] = useVisualUiAtom(contextAtom)
    const editorRef = useRef<any>()
    const enableClickEventsRef = useRef();
    const [codeEditorVisible, setCodeEditorVisible] = useState(false)
    const [currentPageContent, setCurrentPageContent] = useState("")
    const [monacoSourceCode, setMonacoSourceCode] = useState(currentPageContent)
    const [monacoHasChanges, setMonacoHasChanges] = useState(false)
    const [flowViewMode, setFlowViewMode] = useState('preview')
    const [isSideBarVisible, setIsSideBarVisible] = useState(false)
    const [customizeVisible, setCustomizeVisible] = useState(true);
    const [layerVisible, setLayerVisible] = useState(false);
    const [selectedFrame, setSelectedFrame] = useState('desktop');

    const router = useRouter();
    const { resolvedTheme, toggle: themeToggle, current: currentTheme } = useThemeSetting();

    // const resolvedTheme = 'dark'

    const { publish } = topics;
    const { data } = topics;
    const [openPanel, setOpenPanel] = React.useState(false);

    const isViewModePreview = flowViewMode == 'preview'
    const barHeight = "50px"
    const mainPanelHeight = 'calc(100vh - ' + barHeight + ')'
    const separatorColor = useUITheme('separatorColor')

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
                    const filteredMissingJsxImports = [...new Map(missingJsxImports.map(item => [item['tagName'], item])).values()]
                    const missingJsxImportsText = filteredMissingJsxImports.reduce((total, impData) => {
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

    const onToggleAppBar = (val) => {
        if (val == 'code') {
            codeEditorVisible ? setIsSideBarVisible(!isSideBarVisible) : setIsSideBarVisible(true)
            setFlowViewMode(undefined);
            setCodeEditorVisible(true);
        } else if (val == 'flow') {
            flowViewMode == val ? setIsSideBarVisible(!isSideBarVisible) : setIsSideBarVisible(true)
            setFlowViewMode(val)
            setCodeEditorVisible(false)
        } else if (val == 'preview') {
            const isValidMode = ['flow-preview', 'preview'].includes(flowViewMode)
            isValidMode ? setIsSideBarVisible(!isSideBarVisible) : setIsSideBarVisible(true)
            setFlowViewMode(isValidMode ? flowViewMode : val)
            setCodeEditorVisible(false)
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

    const onCancelEdit = () => {
        router.push({
            query: {}
        })
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
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: mainPanelHeight }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 999999, backgroundColor: useUITheme('nodeBackgroundColor'), borderBottom: '1px solid ' + separatorColor }}>
                    <XStack padding="10px" display={monacoHasChanges && codeEditorVisible ? 'flex' : 'none'} theme={"dark"} marginVertical="$1">
                        <Button size="$3" chromeless circular marginRight="$2" onPress={onCancelMonaco}>
                            <X />
                        </Button>
                        <Button size="$3" chromeless circular onPress={() => onEditorSave("monaco", monacoSourceCode)}>
                            <Save fillOpacity={0} />
                        </Button>
                    </XStack>
                    <XStack padding="10px" display={['flow-preview', 'preview'].includes(flowViewMode) ? 'flex' : 'none'} >
                        <ToggleGroup borderWidth="$0" theme={resolvedTheme == 'dark' ? 'dark' : 'light'} type="single" defaultValue="preview" disableDeactivation>
                            <ToggleGroup.Item
                                hoverStyle={{ backgroundColor: flowViewMode == "flow-preview" ? useUITheme('interactiveHoverColorDarken') : useUITheme('interactiveHoverColor') }}
                                focusStyle={{ backgroundColor: flowViewMode == "flow-preview" ? useUITheme('interactiveColor') : useUITheme('inputBackgroundColor') }}
                                backgroundColor={flowViewMode == "flow-preview" ? useUITheme('interactiveColor') : useUITheme('inputBackgroundColor')}
                                value="flow-preview"
                                onPress={() => setFlowViewMode('flow-preview')}
                            >
                                <Workflow fillOpacity={0} color={flowViewMode == "flow-preview"  && resolvedTheme != 'dark' ? useUITheme('nodeBackgroundColor') : useUITheme('textColor')}/>
                            </ToggleGroup.Item>
                            <ToggleGroup.Item
                                hoverStyle={{ backgroundColor: flowViewMode == "preview" ? useUITheme('interactiveHoverColorDarken') : useUITheme('interactiveHoverColor') }}
                                focusStyle={{ backgroundColor: flowViewMode == "preview" ? useUITheme('interactiveColor') : useUITheme('inputBackgroundColor') }}
                                backgroundColor={flowViewMode == "preview" ? useUITheme('interactiveColor') : useUITheme('inputBackgroundColor')}
                                value="preview"
                                onPress={() => setFlowViewMode('preview')}
                            >
                                <SlidersHorizontal fillOpacity={0} color={flowViewMode == "preview" && resolvedTheme != 'dark' ? useUITheme('nodeBackgroundColor') : useUITheme('textColor')} />
                            </ToggleGroup.Item>
                        </ToggleGroup>
                    </XStack>
                </div>
                <div style={{ display: codeEditorVisible ? 'flex' : 'none', flex: 1 }}>
                    <Monaco
                        onChange={onMonacoChange}
                        sourceCode={monacoSourceCode}
                    />
                </div>
                <div style={{ opacity: 1, marginRight: 0, flex: 1, display: codeEditorVisible ? 'none' : 'flex', flexDirection: 'column', backgroundColor: useUITheme('nodeBackgroundColor') }}>
                    <SidebarItem
                        icon={Pencil}
                        title="Customize"
                        height={!layerVisible ? 'full' : '55%'}
                        visible={customizeVisible}
                        onChange={(val) => setCustomizeVisible(val)}
                    >
                        <VisualUiFlows
                            disableDots={!isActive || isViewModePreview}
                            sourceCode={currentPageContent}
                            setSourceCode={setCurrentPageContent}
                            customComponents={getFlowsCustomComponents(router.pathname, router.query)}
                            onSave={(code, _, data) => onEditorSave('flows', code, data)}
                            config={{ masks: getFlowMasks(router.pathname, router.query) }}
                            zoomOnDoubleClick={!isViewModePreview}
                            themeMode={resolvedTheme}
                            bgColor={'transparent'}
                            theme={Theme[resolvedTheme]}
                            nodePreview={flowViewMode}
                            metadata={metadata}
                            contextAtom={contextAtom}
                            defaultSelected={data => Object.keys(data ?? {}).find(n => n.startsWith('JsxElement') && data[n].name == 'Page')}
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

    const EditorPanel = (
        <div id="editor-layout" style={{ flex: 1, display: 'flex', minWidth: "280px", borderRight: '2px solid ' + separatorColor }}>
            <EditorLayout
                metadata={metadata}
                frame={selectedFrame}
                currentPageContent={currentPageContent}
                onSave={() => null}
                resolveComponentsDir={resolveComponentsDir}
                contextAtom={contextAtom}
            >
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

    useEffect(() => {
        // Prevents click events to interact inside editor-layout
        const handleEvent = (e) => {
            if (enableClickEventsRef.current) return
            e.preventDefault();
            e.stopPropagation();
        }
        document.getElementById("editor-layout")?.addEventListener('click', handleEvent)
        return () => document.getElementById("editor-layout")?.removeEventListener('click', handleEvent)
    }, [])

    // for outside context usage
    const options = {
        resolver: availableCraftComponents,
        onRender: ({ ...props }: any) => RenderNode({ ...props, onEnableEvents: (s) => { enableClickEventsRef.current = s } })
    }
    const context = newVisualUiContext(options)
    if (setContext) setContext(context) // atom shared context

    return <div ref={editorRef} style={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'column' }}>
        <Editor
            {...options}
            parentContext={context}
        >
            <EditorBar
                height={barHeight}
                leftItems={[
                    {
                        id: "components-to-drag-btn",
                        icon: Component,
                        buttonProps: {
                            chromeless: false, color: "white", backgroundColor: useUITheme('interactiveColor'),
                            hoverStyle: { backgroundColor: useUITheme('interactiveHoverColorDarken') }
                        },
                        onPress: () => setOpenPanel(true)
                    },
                    {
                        icon: currentTheme == 'light' ? Sun : currentTheme == 'dark' ? Moon : SunMoon,
                        onPress: themeToggle
                    },
                    {
                        icon: LogOut,
                        onPress: onCancelEdit
                    }
                ]}
                rightItems={[
                    // {
                    //     icon: selectedFrame == 'tablet' ? Tablet : selectedFrame == 'mobile' ? Smartphone : Monitor,
                    //     menuProps: { placement: 'bottom-end' },
                    //     menu: [
                    //         {
                    //             text: 'Desktop',
                    //             icon: selectedFrame == 'desktop' ? Check : null,
                    //             onPress: () => setSelectedFrame('desktop')
                    //         },
                    //         {
                    //             text: 'Tablet',
                    //             icon: selectedFrame == 'tablet' ? Check : null,
                    //             onPress: () => setSelectedFrame('tablet')
                    //         },
                    //         {
                    //             text: 'Mobile',
                    //             icon: selectedFrame == 'mobile' ? Check : null,
                    //             onPress: () => setSelectedFrame('mobile')
                    //         }
                    //     ]
                    // },
                    {
                        icon: Code,
                        onPress: () => onToggleAppBar('code')
                    },
                    {
                        icon: Network,
                        onPress: () => onToggleAppBar('flow')
                    },
                    {
                        id: "save-nodes-btn",
                        text: 'Save',
                        buttonProps: { 
                            chromeless: false, color: 'white', backgroundColor: useUITheme('interactiveColor'), paddingHorizontal: "$4", 
                            hoverStyle: { backgroundColor: useUITheme('interactiveHoverColorDarken') }
                        },
                        onPress: () => publish("savenodes", { value: 'visual-ui' })
                    },
                    {
                        icon: PanelRight,
                        onPress: () => onToggleAppBar('preview')
                    }
                ]}
            />
            <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <MainPanel
                    openPanel={openPanel}
                    setOpenPanel={setOpenPanel}
                    leftPanelContent={SidebarPanel}
                    centerPanelContent={EditorPanel}
                    borderLess
                    height={mainPanelHeight}
                    rightPanelContent={FlowPanel}
                    rightPanelResizable={!isViewModePreview}
                    rightPanelWidth={!isViewModePreview ? 50 : 0}
                    rightPanelVisible={isSideBarVisible}
                />
            </div>
        </Editor>
    </div>

}

export default memo(withTopics(UIEditor, { topics: ['zoomToNode'] }));