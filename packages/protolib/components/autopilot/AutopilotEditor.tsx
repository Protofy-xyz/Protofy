import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView, Text, Input, XStack, Button, useTheme } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { useThemeSetting } from '@tamagui/next-theme'
import { JSONView } from "../JSONView";
import { useCallback, useMemo, useRef, useState } from "react";
import { AlignLeft, Braces, Copy, Globe, LayoutDashboard, Search, Settings } from "@tamagui/lucide-icons";
import { useSettingValue } from "@extensions/settings/hooks";
import { CodeView } from '@extensions/files/intents';
import { TabBar } from "../../components/TabBar";

function flattenObject(obj, prefix = "", maxDepth = undefined, currentDepth = 1) {
    let result = [];
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];
        const newPath = prefix ? prefix + " -> " + key : key;

        if (typeof value === "object" && value !== null && currentDepth < maxDepth) {
            if (Object.keys(value).length > 0) {
                const nested = flattenObject(value, prefix, maxDepth, currentDepth + 1);
                result.push(...nested);
            } else {
                result.push([[newPath], JSON.stringify(newPath)]);
            }

        } else {
            result.push([[newPath], newPath]);
        }
    }

    return result;
}

function filterObjectBySearch(data, search) {
    if (data === null || data === undefined) return undefined;
    const lowerSearch = search.toLowerCase();

    if (typeof data !== "object") {
        const strData = String(data).toLowerCase();
        return strData.includes(lowerSearch) ? data : undefined;
    }

    if (Array.isArray(data)) {
        const filteredArr = [];
        for (const item of data) {
            const filteredItem = filterObjectBySearch(item, search);
            if (filteredItem !== undefined) {
                filteredArr.push(filteredItem);
            }
        }
        return filteredArr.length > 0 ? filteredArr : undefined;
    }

    const result = {};
    for (const [key, value] of Object.entries(data)) {
        const keyMatches = key.toLowerCase().includes(lowerSearch);
        const filteredValue = filterObjectBySearch(value, search);

        if (keyMatches || filteredValue !== undefined) {
            result[key] = filteredValue === undefined ? value : filteredValue;
        }
    }

    return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * A partir de un objeto JS, genera una declaración TS
 * con todas las propiedades opcionales y arrays tipados.
 */
function generateStatesDeclaration(name, statesObj: any): string {
    function inferType(value: any): string {
        if (value === null || value === undefined) {
            return 'any';
        }
        switch (typeof value) {
            case 'string': return 'string';
            case 'number': return 'number';
            case 'boolean': return 'boolean';
            case 'function': return '(...args: any[]) => any';
        }
        if (Array.isArray(value)) {
            // Inferir tipo de elementos y unificarlos si hay varios
            const types = Array.from(new Set(value.map(inferType)));
            const itemType = types.length > 0
                ? types.join(' | ')
                : 'any';
            return `Array<${itemType}>`;
        }
        // Objeto: todas las claves opcionales
        const props = Object.entries(value).map(([key, val]) => {
            const t = inferType(val);
            // notación "key"?: type
            return `"${key}"?: ${t}`;
        });
        return `{ ${props.join('; ')} }`;
    }

    const tsType = inferType(statesObj);
    return `declare const ${name}: ${tsType};`;
}

const FormattedView = ({ maxDepth = 1, copyIndex = 1, displayIndex = 1, data, hideValue = false, onCopy = (text) => text }) => {
    const [showCopied, setShowCopied] = useState<number | null>(null)

    // Evita recalcular si `data` no cambia
    const list = useMemo(() => {
        if (!data || typeof data !== 'object') return [];
        return flattenObject(data, "", maxDepth);
    }, [data, maxDepth]);

    const handleCopy = useCallback((text: string, index: number) => {
        const copiedText = onCopy(text)
        navigator.clipboard.writeText(copiedText)
        setShowCopied(index)
        setTimeout(() => setShowCopied(null), 700)
    }, [onCopy])


    return (
        <>
            {list.map((line, index) => {
                const isCopied = showCopied === index
                const keyLabel = line[0]
                const value = line[copyIndex]

                return (
                    <XStack key={keyLabel + index} cursor="pointer" p="$2" px="$4" bg="$gray2" gap="$2" br="$4" hoverStyle={{ backgroundColor: "$color5" }} onPress={() => handleCopy(value, index)}>
                        {isCopied && (
                            <Text fos="$4" color="$color7" pos="absolute" left="$4" >
                                copied to clipboard!
                            </Text>
                        )}

                        <XStack opacity={isCopied ? 0 : 1} mr="$5">
                            <Text fos="$4">
                                {keyLabel + (hideValue ? '' : ' : ')}
                            </Text>
                            {!hideValue && (
                                <Text fos="$4" color="$color7">
                                    {line[displayIndex] || value}
                                </Text>
                            )}
                        </XStack>

                        <YStack flex={1} hoverStyle={{ opacity: 1 }} opacity={0}>
                            <Copy display="flex" color="$blue8" pos="absolute" r="$1" top={2} size={14} />
                        </YStack>
                    </XStack>
                )
            })}
        </>
    )
}

function getBoardIdFromActionUrl(path: string): string | null {
    const match = path.match(/^\/api\/core\/v1\/boards\/([^\/]+)\/actions\/.+$/);
    return match ? match[1] : null;
}

const generateParamsDeclaration = (cardData) => {
    if (!cardData.params || Object.keys(cardData.params).length === 0) return '';

    const params = Object.entries(cardData.params).map(([key, value]) => {
        return `\t"${key}": ${typeof value === 'string' ? `'${value}'` : value}, // ${value}`;
    }).join('\n');

    return `declare const params: {\n${params}\n};`;
}

export const AutopilotEditor = ({ cardData, board, panels = ['actions', 'staes'], actions, states, rules, rulesCode, setRulesCode, value, valueReady = true, setRules }) => {
    const { resolvedTheme } = useThemeSetting()
    const [inputMode, setInputMode] = useState<"json" | "formatted">("formatted")
    const [search, setSearch] = useState('')
    const [stateSearch, setStateSearch] = useState('')

    // Show/hide action and state tabs
    const showActionsTabs = false
    const showStatesTabs = false

    const cleanedActions = useMemo(() => {
        const cleaned = {};
        if (!actions || typeof actions !== 'object') return cleaned;
        for (const [level1Key, level1Value] of Object.entries(actions)) {
            if (!level1Value || typeof level1Value !== 'object') continue;
            for (const [level2Key, level2Value] of Object.entries(level1Value)) {
                if (!level2Value || typeof level2Value !== 'object') continue;
                const { name, description, params, url } = level2Value;
                if (!cleaned[level1Key]) cleaned[level1Key] = {};
                cleaned[level1Key][level2Key] = { name, description, params, url };
            }
        }
        return cleaned;
    }, [actions]);

    const isAIEnabled = useSettingValue('ai.enabled', false);

    const filteredData = useMemo(() => {
        const filtered = filterObjectBySearch(cleanedActions?.[board.name] ?? {}, search)
        return filtered
    }, [cleanedActions, search]);

    const filteredStateData = useMemo(() => {
        const filtered = filterObjectBySearch(states?.[board.name] ?? {}, stateSearch)
        return filtered
    }, [states, stateSearch]);

    const actionData = filteredData

    const statesPanel = useMemo(() => {
        return <YStack gap="$2" ai="flex-start">
            <JSONView collapsed={3} style={{ backgroundColor: 'var(--gray3)' }} src={filteredStateData} enableClipboard={(copy) => {
                const path = 'board' + copy.namespace
                    .filter(v => v)
                    .map(k => `?.[${JSON.stringify(k)}]`)
                    .join('')

                console.log('Key path:', path)
                navigator.clipboard.writeText(path)
                return false
            }} />
        </YStack>
    }, [filteredStateData, board?.name]);

    const actionsPanel = useMemo(() => {
        return <YStack gap="$2" ai="flex-start">
            {inputMode === "formatted" && <FormattedView hideValue={true} onCopy={text => {
                const val = actions[board.name][text];
                if (!val || !val.url) return '';
                const targetBoard = getBoardIdFromActionUrl(val.url);
                let copyVal = val.url;
                if (targetBoard && targetBoard === board?.name) {
                    copyVal = val.name
                }

                return `await executeAction({name: "${copyVal}", params: {
${Object.entries(val.params || {}).map(([key, value]) => {
                    return `\t${key}: '', // ${value}`;
                }).join('\n')}
}})`
            }} data={actionData} />}
            {inputMode == "json" && <JSONView collapsed={3} style={{ backgroundColor: 'var(--gray3)' }} src={filteredData} />}
        </YStack>
    }, [filteredData, actionData, inputMode, board?.name]);


    const declarations = useMemo(() => {
        const decl = generateStatesDeclaration('states', { board: states });
        return `
${decl}
${cardData.type == 'action' ? `declare function executeAction({name: string, params?: Record<string, any>}): void;` : ''}
${cardData.type == 'action' ? generateParamsDeclaration(cardData) : ''}`
    }, [states, cardData]);


    const theme = useTheme()
    const editedCode = useRef(rulesCode ?? 'return;')
    const [selectedActionTab, setSelectedActionTab] = useState('board')
    const [selectedStateTab, setSelectedStateTab] = useState('board')

    const flows = useMemo(() => {
        return <CodeView
            rulesWithFlows={true}
            pathname={cardData.type == 'action' ? '/rules' : '/observerCard'}
            onApplyRules={async (rules) => {
                return await setRules(rules)
            }}
            disableAIPanels={!isAIEnabled}
            defaultMode={isAIEnabled ? 'rules' : 'code'}
            rules={rules}
            viewPort={{ x: 20, y: window.innerHeight / 8, zoom: 0.8 }}
            onFlowChange={(code) => {
                editedCode.current = code
                setRulesCode(code)
            }}
            onCodeChange={(code) => {
                editedCode.current = code
                setRulesCode(code)
            }}
            path={cardData.name + '.ts'}
            flowsPath={cardData.name}
            sourceCode={editedCode}
            monacoOnMount={(editor, monaco) => {
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions?.({
                    // noSemanticValidation: false,
                    // noSyntaxValidation: false,
                    // @ts-ignore
                    diagnosticCodesToIgnore: [1375, 1108],
                });
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ESNext,
                    module: monaco.languages.typescript.ModuleKind.None,
                    allowNonTsExtensions: true,
                    allowJs: true,
                    allowSyntheticDefaultImports: true,
                    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                    noEmit: true,
                    typeRoots: ["node_modules/@types"],
                    allowUmdGlobalAccess: true,
                    resolveJsonModule: true,
                    isolatedModules: false,
                    useDefineForClassFields: true,
                    lib: ["esnext"],
                })
                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    declarations,
                    'ts:filename/customTypes.d.ts'
                );
            }}
            monacoOptions={{
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                lineNumbers: true,
                minimap: { enabled: false }
            }}
        />
    }, [resolvedTheme, board.name, theme, isAIEnabled]);

    const actionsTab = [
        { id: 'board', label: 'Board', icon: <LayoutDashboard size={"$1"} />, content: actionsPanel },
        { id: 'global', label: 'Global', icon: <Globe size={"$1"} />, content: <h1>Global actions panel (todo)</h1> },
        { id: 'system', label: 'System', icon: <Settings size={"$1"} />, content: <h1>System actions panel (todo)</h1> }
    ]

    const statesTab = [
        { id: 'board', label: 'Board', icon: <LayoutDashboard size={"$1"} />, content: statesPanel },
        { id: 'global', label: 'Global', icon: <Globe size={"$1"} />, content: <h1>Global states panel (todo)</h1> },
        { id: 'system', label: 'System', icon: <Settings size={"$1"} />, content: <h1>System states panel (todo)</h1> }
    ]

    const selectedAction = useMemo(
        () => actionsTab.find(t => t.id === selectedActionTab),
        [actionsTab, selectedActionTab]
    );

    const selectedState = useMemo(
        () => statesTab.find(t => t.id === selectedStateTab),
        [statesTab, selectedStateTab]
    );

    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={30}>
                <PanelGroup direction="vertical">
                    {panels.includes('actions') && <Panel defaultSize={50} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" borderRadius="$3" p="$3" gap="$2" backgroundColor="$gray3" overflow="hidden" >
                            <XStack pb={8}>
                                <Search pos="absolute" left="$3" top={14} size={16} />
                                <Input
                                    bg="$gray1"
                                    color="$gray12"
                                    paddingLeft="$7"
                                    bw={0}
                                    h="47px"
                                    boc="$gray6"
                                    // br={100}
                                    w="100%"
                                    placeholder="search..."
                                    placeholderTextColor="$gray9"
                                    outlineColor={"$gray8"}
                                    value={search}
                                    onChangeText={setSearch}
                                />
                            </XStack>
                            <XStack jc="space-between" width="100%">
                                <p>Actions</p>
                                <XStack gap="$2">
                                    <Button
                                        icon={AlignLeft}
                                        bc={inputMode === "formatted" ? "$color5" : "$gray4"}
                                        scaleIcon={1.6}
                                        size="$2"
                                        onPress={() => setInputMode("formatted")}
                                    />
                                    <Button
                                        icon={Braces}
                                        bc={inputMode === "json" ? "$color5" : "$gray4"}
                                        scaleIcon={1.6}
                                        size="$2"
                                        onPress={() => setInputMode("json")}
                                    />
                                </XStack>
                            </XStack>
                            <ScrollView flex={1} width="100%" height="100%" overflow="auto">
                                {showActionsTabs ? (
                                    <>
                                        <TabBar
                                            tabs={actionsTab}
                                            selectedId={selectedActionTab}
                                            onSelect={setSelectedActionTab}
                                        />
                                        <XStack mt="$2">
                                            {selectedAction?.content ?? null}
                                        </XStack>
                                    </>
                                ) : (
                                    actionsPanel
                                )}
                            </ScrollView>
                        </YStack>
                    </Panel>}
                    <CustomPanelResizeHandle direction="horizontal" />
                    <Panel defaultSize={50} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" borderRadius="$3" p="$3" gap="$2" backgroundColor="$gray3" overflow="hidden" >
                            <XStack pb={8}>
                                <Search pos="absolute" left="$3" top={14} size={16} />
                                <Input
                                    bg="$gray1"
                                    color="$gray12"
                                    paddingLeft="$7"
                                    bw={0}
                                    h="47px"
                                    boc="$gray6"
                                    // br={100}
                                    w="100%"
                                    placeholder="search..."
                                    placeholderTextColor="$gray9"
                                    outlineColor={"$gray8"}
                                    value={stateSearch}
                                    onChangeText={setStateSearch}
                                />
                            </XStack>
                            <XStack jc="space-between" width="100%">
                                <p>State</p>
                            </XStack>
                            <ScrollView flex={1} width="100%" height="100%" overflow="auto" >
                                {showStatesTabs ? (
                                    <>
                                        <TabBar
                                            tabs={statesTab}
                                            selectedId={selectedStateTab}
                                            onSelect={setSelectedStateTab}
                                        />
                                        <XStack mt="$2">
                                            {selectedState?.content ?? null}
                                        </XStack>
                                    </>
                                ) : (
                                    statesPanel
                                )}
                            </ScrollView>

                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>

            <CustomPanelResizeHandle direction="vertical" />

            {/* Rigth panel */}
            <Panel defaultSize={70} minSize={20}>
                <YStack flex={1} height="100%" borderRadius="$3" p="$3" gap="$2" backgroundColor="$gray3" overflow="hidden" >
                    <Tinted>{flows}</Tinted>
                </YStack>
            </Panel>
        </PanelGroup>
    );
};
