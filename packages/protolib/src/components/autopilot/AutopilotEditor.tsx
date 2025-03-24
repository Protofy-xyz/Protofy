import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView, Spinner, Text, Input, XStack, Button } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Rules } from "./Rules";
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from "../Monaco";
import { JSONView } from "../JSONView";
import { useState } from "react";
import { AlignLeft, Braces, Copy, Search } from "@tamagui/lucide-icons";

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

const FormattedView = ({ data }) => {
    const [hovered, setHovered] = useState(null)
    const [showCopied, setShowCopied] = useState(null)

    const list = flattenObject(data)

    return <>
        {list.map((line, index) => (
            <XStack
                key={index}
                cursor="pointer"
                p="$2"
                px="$4"
                bg="$gray2"
                gap="$2"
                br="$4"
                hoverStyle={{ backgroundColor: "$color5" }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onPress={() => {
                    navigator.clipboard.writeText(line[0])
                    setShowCopied(index)
                    setTimeout(() => setShowCopied(null), 700)
                }}
            >
                <Text display={showCopied == index ? "flex" : "none"} fos={"$4"} color="$color7" pos="absolute" left="$4">
                    copied to clipboard!
                </Text>
                <XStack o={showCopied == index ? 0 : 1}>
                    <Text fos="$4">
                        {line[0] + " : "}
                    </Text>
                    <Text fos="$4" color="$color7">
                        {line[1]}
                    </Text>
                </XStack>
                <Copy
                    display={hovered == index ? "flex" : "none"}
                    color="$blue8"
                    pos="absolute"
                    r="$2"
                    top="$2.5"
                    size={14}
                />
            </XStack>
        ))}
    </>
}


export const AutopilotEditor = ({ data, rules, rulesCode, setRulesCode, value, valueReady = true, onAddRule = (e, rule) => { }, onDeleteRule = (index) => { } }) => {
    const { resolvedTheme } = useThemeSetting()
    const [inputMode, setInputMode] = useState<"json" | "formatted">("json")
    const [search, setSearch] = useState('')

    const filteredData = filterObjectBySearch(data, search)

    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={30}>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={66} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" borderRadius="$3" p="$3" gap="$2" backgroundColor="$gray3" overflow="hidden" >
                            <XStack jc="space-between" width="100%">
                                <p>Input</p>
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
                                    <YStack miw="600px" gap="$2" ai="flex-start">
                                        {inputMode === "formatted" && <FormattedView data={filteredData} />}
                                        {inputMode == "json" && <JSONView style={{ backgroundColor: 'var(--gray3)' }} src={filteredData} />}
                                    </YStack>
                                </Tinted>
                            </ScrollView>
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
                        </YStack>
                    </Panel>

                    <CustomPanelResizeHandle direction="horizontal" />

                    <Panel defaultSize={34} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" borderRadius="$3" p="$3" backgroundColor="$gray3" overflow="hidden" >

                            <p>Output</p>
                            {!valueReady && rules.length !== 0 && <YStack f={1} jc="center" ><Spinner /></YStack>}
                            {!valueReady && rules.length === 0 && <Text opacity={0.6}>No output available. Create a rule to get started.</Text>}
                            {valueReady && <ScrollView flex={1} width="100%" height="100%" overflow="auto" >

                                <Tinted>
                                    {valueReady && <div style={{ minWidth: "600px" }}>
                                        <JSONView style={{ backgroundColor: 'var(--gray3)' }} src={value} />
                                    </div>}
                                    {!valueReady && <Spinner />}
                                </Tinted>

                            </ScrollView>
                            }
                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>

            <CustomPanelResizeHandle direction="vertical" />

            {/* Rigth panel */}
            <Panel defaultSize={70} minSize={50}>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={100} minSize={20} maxSize={100}>
                        <YStack
                            flex={1} height="100%" alignItems="center" justifyContent="center" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                            <Rules
                                rules={rules}
                                onAddRule={onAddRule}
                                onDeleteRule={onDeleteRule}
                                loadingIndex={-1}
                            />
                        </YStack>
                    </Panel>
                    <CustomPanelResizeHandle direction="horizontal" />
                    <Panel defaultSize={0} minSize={0} maxSize={80}>
                        <YStack flex={1} height="100%" alignItems="center" justifyContent="center" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                            <Monaco
                                path={'autopilot-rules.ts'}
                                darkMode={resolvedTheme === 'dark'}
                                sourceCode={rulesCode}
                                onChange={setRulesCode}
                                options={{
                                    folding: false,
                                    lineDecorationsWidth: 0,
                                    lineNumbersMinChars: 0,
                                    lineNumbers: false,
                                    minimap: { enabled: false }
                                }}
                            />
                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
};
