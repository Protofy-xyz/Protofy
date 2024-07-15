import { memo, useEffect, useState, useRef } from "react";
import { useSearchParams, usePathname } from 'solito/navigation';
import { Editor } from "@protocraft/core";
import { Layers } from "@protocraft/layers";
import { RenderNode } from './RenderNode';
import systemPalette from '../palettes';
import EditorLayout from "./EditorLayout";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "protolib/components/MainPanel";
import Monaco from "./Monaco";
import { Plus, LogOut, Network, Workflow, SlidersHorizontal, Code, Layers as Layers3, Pencil, Save, X, PanelRight, Monitor, Tablet, Smartphone, SunMoon, Sun, Moon } from "lucide-react";
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
    const monacoRef = useRef(null);

    const codeRef = useRef("")
    const flowsData = useRef({})
    const enableClickEventsRef = useRef();
    const [codeEditorVisible, setCodeEditorVisible] = useState(false)
    const [currentPageContent, setCurrentPageContent] = useState("")
    const [flowViewMode, setFlowViewMode] = useState("undefined")
    const [isSideBarVisible, setIsSideBarVisible] = useState(false)
    const [customizeVisible, setCustomizeVisible] = useState(true);
    const [layerVisible, setLayerVisible] = useState(false);
    const [selectedFrame, setSelectedFrame] = useState('desktop');

    const isCodeActive = codeEditorVisible && isSideBarVisible

    const searchParams = useSearchParams();
    const query = Object.fromEntries(searchParams.entries());
    const pathname = usePathname();

    const { resolvedTheme, toggle: themeToggle, current: currentTheme } = useThemeSetting();

    // const resolvedTheme = 'dark'

    const { publish } = topics;
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

    const allPalettes = {
        //@ts-ignore
        atoms: { ...systemPalette.atoms, ...userPalettes?.atoms }, molecules: { ...userPalettes?.molecules },
    }
    const allPalettesAtoms = allPalettes.atoms

    const getCraftComponents = (enableDropable?: boolean) => { // FIX: If components of diferent palette has the same name will overwrite
        let filteredPalettes = Object.keys(allPalettesAtoms)
        if (enableDropable) {
            filteredPalettes = filteredPalettes.filter(key => key != 'craft')
        }
        return filteredPalettes.reduce((total, paletteName) => total = { ...total, ...allPalettesAtoms[paletteName] }, {})
    }
    const availableCraftComponents = getCraftComponents()

    const loadPage = async () => {
        setCurrentPageContent(sourceCode)
    }

    const onEditorSave = async (code, data?, forceReload?) => {
        var content = code
        if (data) {
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
        }
        sendMessage({ type: 'save', data: { content } })
        codeRef.current = content
        if (forceReload) setCurrentPageContent(content)
    }

    const onToggleAppBar = (val) => {
        if (val == 'code') {
            codeEditorVisible ? setIsSideBarVisible(!isSideBarVisible) : setIsSideBarVisible(true)
            setFlowViewMode(undefined);
            setCodeEditorVisible(!codeEditorVisible);
        } else if (val == 'flow') {
            flowViewMode == val ? setIsSideBarVisible(!isSideBarVisible) : setIsSideBarVisible(true)
            setFlowViewMode(val)
            setCodeEditorVisible(false)
        } else if (val == 'preview') {
            const isValidMode = ['flow-preview', 'preview'].includes(flowViewMode)
            if (isValidMode) {
                setIsSideBarVisible(!isSideBarVisible)
                setFlowViewMode("undefined")
            } else {
                setIsSideBarVisible(true)
                setFlowViewMode(val)
            }
            setCodeEditorVisible(false)
        }
    }

    const onMonacoChange = (code) => {
        monacoRef.current = code;
    }

    const onCancelEdit = () => {
        document.location.href = document.location.href.split('?')[0]
    }

    useEffect(() => {
        loadPage()
    }, [sourceCode]);

    const FlowPanel = (
        <div
            key="auxiliarySidebar"
            // FIX: Make disapear panel div while not visible, can't hide it from first render with display: isSidebarVisible ? 'flex':'none'
            style={{ display: 'flex', width: '100%', top: isSideBarVisible ? 0 : -1000000000000, position: isSideBarVisible ? 'relative' : 'absolute', height: '100%' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: mainPanelHeight }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 999999, backgroundColor: useUITheme('nodeBackgroundColor'), borderBottom: '1px solid ' + separatorColor }}>
                    <XStack padding="10px" display={codeEditorVisible ? 'flex' : 'none'} theme={"dark"} marginVertical="$1">
                        {/* <Button hoverStyle={{ backgroundColor: useUITheme('secondaryBackground') }} size="$3" chromeless circular marginRight="$2" onPress={onCancelMonaco}>
                            <X color={useUITheme('textColor')} />
                        </Button> */}
                        <Button chromeless backgroundColor={useUITheme('interactiveColor')} hoverStyle={{ backgroundColor: useUITheme('interactiveHoverColor') }} size="$3" onPress={() => onEditorSave(monacoRef.current?.getValue(), flowsData.current, true)}>
                            <Save color={useUITheme('textColor')} fillOpacity={0} />
                        </Button>
                    </XStack>
                    <XStack padding="10px" display={['flow-preview', 'preview'].includes(flowViewMode) ? 'flex' : 'none'} >
                        {/* @ts-ignore */}
                        <ToggleGroup borderWidth="$0" theme={resolvedTheme == 'dark' ? 'dark' : 'light'} type="single" defaultValue="preview" disableDeactivation>
                            <ToggleGroup.Item
                                hoverStyle={{ backgroundColor: flowViewMode == "flow-preview" ? useUITheme('interactiveHoverColorDarken') : useUITheme('interactiveHoverColor') }}
                                focusStyle={{ backgroundColor: flowViewMode == "flow-preview" ? useUITheme('interactiveColor') : useUITheme('inputBackgroundColor') }}
                                backgroundColor={flowViewMode == "flow-preview" ? useUITheme('interactiveColor') : useUITheme('inputBackgroundColor')}
                                value="flow-preview"
                                onPress={() => setFlowViewMode('flow-preview')}
                            >
                                <Workflow fillOpacity={0} color={flowViewMode == "flow-preview" && resolvedTheme != 'dark' ? useUITheme('nodeBackgroundColor') : useUITheme('textColor')} />
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
                        sourceCode={codeRef.current}
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
                            customComponents={getFlowsCustomComponents(pathname, query)}
                            onSave={(code, _, data) => onEditorSave(code, data)}
                            config={{ masks: getFlowMasks(pathname, query) }}
                            zoomOnDoubleClick={!isViewModePreview}
                            themeMode={resolvedTheme}
                            bgColor={'transparent'}
                            onEdit={(content, data) => {
                                codeRef.current = content
                                flowsData.current = data
                            }}
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
            />
        </div>
    );

    const EditorPanel = (
        <div id="editor-layout" style={{ flex: 1, display: 'flex', minWidth: "280px", borderRight: '2px solid ' + separatorColor }}>
            <EditorLayout
                metadata={metadata}
                frame={selectedFrame}
                currentPageContent={currentPageContent}
                codeRef={codeRef}
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
        onRender: ({ ...props }: any) => RenderNode({ ...props, onEnableEvents: (s) => { enableClickEventsRef.current = s }, metadata })
    }
    const context = newVisualUiContext(options)
    if (setContext) setContext(context) // atom shared context

    return <div ref={editorRef} style={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'column' }}>
        <Editor
            {...options}
            enabled={!isCodeActive}
            parentContext={context}
        >
            <EditorBar
                height={barHeight}
                leftItems={[
                    {
                        id: "components-to-drag-btn",
                        icon: Plus,
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
                        text: 'Exit',
                        onPress: onCancelEdit,
                        buttonProps: {
                            variant: 'outlined', chromeless: false, borderWidth: '$0.5', borderColor: useUITheme('textColor'),
                            hoverStyle: { variant: 'outlined', chromeless: false, borderWidth: '$0.5', borderColor: useUITheme('interactiveColor') }
                        }
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
                        icon: Save,
                        text: 'Save',
                        buttonProps: {
                            disabled: isCodeActive,
                            opacity: isCodeActive ? 0.2 : 1,
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

export default memo(withTopics(UIEditor));