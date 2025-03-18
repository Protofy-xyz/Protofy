import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView, Spinner } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Rules } from "./Rules";
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from "../Monaco";
import { JSONView } from "../JSONView";

export const AutopilotEditor = ({ data, rules, rulesCode, setRulesCode, value, valueReady = true, onAddRule = (e, rule) => { }, onDeleteRule = (index) => { } }) => {
    const { resolvedTheme } = useThemeSetting()

    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={30}>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={66} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" borderRadius="$3" p="$3" backgroundColor="$gray3" overflow="hidden" >
                            <ScrollView flex={1} width="100%" height="100%" overflow="auto" >
                                <Tinted>
                                    <p>Input</p>
                                    <div style={{ minWidth: "600px" }}>
                                        <JSONView style={{ backgroundColor: 'var(--gray3)' }} src={data} />
                                    </div>
                                </Tinted>
                            </ScrollView>
                        </YStack>
                    </Panel>

                    <CustomPanelResizeHandle direction="horizontal" />

                    <Panel defaultSize={34} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" borderRadius="$3" p="$3" backgroundColor="$gray3" overflow="hidden" >
                            <ScrollView flex={1} width="100%" height="100%" overflow="auto" >
                                <Tinted>
                                    <p>Output</p>
                                    {valueReady && <div style={{ minWidth: "600px" }}>
                                        <JSONView style={{ backgroundColor: 'var(--gray3)' }} src={value} />
                                    </div>}
                                    {!valueReady && <Spinner />}
                                </Tinted>
                            </ScrollView>
                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>

            <CustomPanelResizeHandle direction="vertical" />

            {/* Rigth panel */}
            <Panel defaultSize={70} minSize={50}>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={66} minSize={20} maxSize={80}>
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
                    <Panel defaultSize={34} minSize={20} maxSize={80}>
                        <YStack flex={1} height="100%" alignItems="center" justifyContent="center" backgroundColor="$gray3" borderRadius="$3" p="$3" >
                            <Monaco
                                path={'rules.ts'}
                                darkMode={resolvedTheme === 'dark'}
                                sourceCode={rulesCode}
                                onChange={setRulesCode}
                            />
                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
};
