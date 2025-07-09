import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView, Spinner, Text, Input, XStack, Button } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Rules } from "./Rules";
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from "../Monaco";
import { JSONView } from "../JSONView";
import { useCallback, useMemo, useState } from "react";
import { AlignLeft, Braces, Copy, Search } from "@tamagui/lucide-icons";
import { useSettingValue } from "protolib/lib/useSetting";
import { CodeView } from '@extensions/files/intents';

function flattenObject(obj, prefix = "") {
    let result = [];

    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];
        const newPath = prefix ? prefix + " -> " + key : key;

        if (typeof value === "object" && value !== null) {
            const nested = flattenObject(value, newPath);
            result.push(...nested);
        } else {
            result.push([[newPath], [value]]);
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
function generateStatesDeclaration(statesObj: any): string {
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
    return `declare const states: ${tsType};`;
}

const FormattedView = ({ level1Priority = '', level2Priority = '', copyIndex = 1, displayIndex = 1, data, hideValue = false, onCopy = (text) => text }) => {
    const [showCopied, setShowCopied] = useState<number | null>(null)

    // Evita recalcular si `data` no cambia
    const list = useMemo(() => {
        if (!data || typeof data !== 'object') return [];

        const orderedData: Record<string, any> = {};
        const level1Keys = Object.keys(data);

        const sortedLevel1Keys = [
            ...(level1Priority && level1Keys.includes(level1Priority) ? [level1Priority] : []),
            ...level1Keys.filter(k => k !== level1Priority),
        ];

        for (const level1Key of sortedLevel1Keys) {
            const level1Val = data[level1Key];
            if (typeof level1Val !== 'object') continue;

            orderedData[level1Key] = {};

            const level2Keys = Object.keys(level1Val);
            const sortedLevel2Keys = [
                ...(level2Priority && level2Keys.includes(level2Priority) ? [level2Priority] : []),
                ...level2Keys.filter(k => k !== level2Priority),
            ];

            for (const level2Key of sortedLevel2Keys) {
                orderedData[level1Key][level2Key] = level1Val[level2Key];
            }
        }

        return flattenObject(orderedData);
    }, [data, level1Priority, level2Priority]);

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
                    <XStack
                        key={keyLabel + index}
                        cursor="pointer"
                        p="$2"
                        px="$4"
                        bg="$gray2"
                        gap="$2"
                        br="$4"
                        hoverStyle={{ backgroundColor: "$color5" }}
                        onPress={() => handleCopy(value, index)}
                    >
                        {isCopied && (
                            <Text
                                fos="$4"
                                color="$color7"
                                pos="absolute"
                                left="$4"
                            >
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
                            <Copy
                                display="flex"
                                color="$blue8"
                                pos="absolute"
                                r="$1"
                                top={2}
                                size={14}
                            />
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

export const AutopilotEditor = ({ board, panels = ['actions', 'staes'], actions, states, rules, rulesCode, setRulesCode, value, valueReady = true, onAddRule = (e, rule) => { }, onDeleteRule = (index) => { } }) => {
    const { resolvedTheme } = useThemeSetting()
    const [inputMode, setInputMode] = useState<"json" | "formatted">("formatted")
    const [search, setSearch] = useState('')

    const [stateInputMode, setStateInputMode] = useState<"json" | "formatted">("formatted")
    const [stateSearch, setStateSearch] = useState('')

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
        const filtered = filterObjectBySearch(cleanedActions, search)
        return filtered
    }, [cleanedActions, search]);
    const filteredStateData = useMemo(() => {
        const filtered = filterObjectBySearch(states, stateSearch)
        return filtered
    }, [states, stateSearch]);

    const actionData = useMemo(() => {
        const result: Record<string, any> = {};

        const level1Priority = [board.name];

        const level1Keys = Object.keys(filteredData || {});
        const sortedLevel1Keys = [
            ...level1Priority.filter(k => level1Keys.includes(k)),
            ...level1Keys.filter(k => !level1Priority.includes(k))
        ];

        for (const level1Key of sortedLevel1Keys) {
            const level1Value = filteredData?.[level1Key];
            if (typeof level1Value === 'object') {
                result[level1Key] = {};

                const level2Keys = Object.keys(level1Value || {});


                for (const level2Key of level2Keys) {
                    const level2Value = level1Value?.[level2Key];
                    if (typeof level2Value === 'object' && level2Value['url']) {
                        result[level1Key][level2Key] = JSON.stringify(level2Value);
                    }
                }
            }
        }

        return result;
    }, [filteredData, board.name]);

    const statesPanel = useMemo(() => {
        return <YStack gap="$2" ai="flex-start">
            {stateInputMode === "formatted" && <FormattedView level1Priority='boards' level2Priority={board.name} copyIndex={0} onCopy={text => {
                const parts = text[0].split('->').map(p => p.trim());
                let inBoard = false;
                if (text[0].startsWith(board.name + ' -> ')) {
                    //skip boards -> boardName ->
                    parts.splice(0, 1);
                    inBoard = true;
                }

                return (!inBoard ? 'states' : 'board') + parts.map(p => `?.[${isNaN(Number(p)) ? `'${p}'` : p}]`).join('');
            }} data={filteredStateData} />}
            {stateInputMode == "json" && <JSONView collapsed={3} style={{ backgroundColor: 'var(--gray3)' }} src={filteredStateData} />}
        </YStack>
    }, [filteredStateData, stateInputMode, board?.name]);

    const actionsPanel = useMemo(() => {
        return <YStack gap="$2" ai="flex-start">
            {inputMode === "formatted" && <FormattedView hideValue={true} onCopy={text => {
                const val = JSON.parse(text);
                if (!val || !val.url) return '';
                const targetBoard = getBoardIdFromActionUrl(val.url);
                let copyVal = val.url;
                if (targetBoard && targetBoard === board?.name) {
                    copyVal = val.name
                }

                return `await execute_action("${copyVal}", {
${Object.entries(val.params || {}).map(([key, value]) => {
                    return `\t${key}: '', // ${value}`;
                }).join('\n')}
})`
            }} data={actionData} />}
            {inputMode == "json" && <JSONView collapsed={3} style={{ backgroundColor: 'var(--gray3)' }} src={filteredData} />}
        </YStack>
    }, [filteredData, actionData, inputMode, board?.name]);

    const monacoEditor = useMemo(() => {
        return <Monaco
            path={'autopilot-rules.js'}
            darkMode={resolvedTheme === 'dark'}
            sourceCode={rulesCode}
            onChange={setRulesCode}
            onMount={(editor, monaco) => {
                const decl = generateStatesDeclaration(states);

                monaco.languages.typescript.javascriptDefaults.addExtraLib(`
${decl}
declare function execute_action(name_or_url: string, params?: Record<string, any>): void;
declare const params: Record<string, any>;
        `);
            }}
            options={{
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                lineNumbers: false,
                minimap: { enabled: false }
            }}
        />

    }, [rulesCode, resolvedTheme, setRulesCode]);

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
                            <ScrollView flex={1} width="100%" height="100%" overflow="auto" >
                                <Tinted>
                                    {actionsPanel}
                                </Tinted>
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
                                <XStack gap="$2">
                                    <Button
                                        icon={AlignLeft}
                                        bc={inputMode === "formatted" ? "$color5" : "$gray4"}
                                        scaleIcon={1.6}
                                        size="$2"
                                        onPress={() => setStateInputMode("formatted")}
                                    />
                                    <Button
                                        icon={Braces}
                                        bc={inputMode === "json" ? "$color5" : "$gray4"}
                                        scaleIcon={1.6}
                                        size="$2"
                                        onPress={() => setStateInputMode("json")}
                                    />
                                </XStack>
                            </XStack>
                            <ScrollView flex={1} width="100%" height="100%" overflow="auto" >
                                <Tinted>
                                    {statesPanel}
                                </Tinted>
                            </ScrollView>

                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>

            <CustomPanelResizeHandle direction="vertical" />

            {/* Rigth panel */}
            <Panel defaultSize={70} minSize={20}>
                <PanelGroup direction="vertical">
                    {isAIEnabled && <Panel defaultSize={66} minSize={0} maxSize={100}>
                        <YStack
                            flex={1} height="100%" alignItems="center" justifyContent="center" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                            <Rules
                                rules={rules}
                                onAddRule={onAddRule}
                                onDeleteRule={onDeleteRule}
                                loadingIndex={-1}
                            />
                        </YStack>
                    </Panel>}
                    <CustomPanelResizeHandle direction="horizontal" />
                    <Panel defaultSize={isAIEnabled ? 34 : 100} minSize={0} maxSize={100}>
                        <YStack flex={1} height="100%" alignItems="center" justifyContent="center" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                            {monacoEditor}
                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
};
