import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView, Spinner, Tabs, SizableText, H5, ToggleGroup, XStack } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import JSONViewer from "../jsonui/JSONViewer";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Rules } from "./Rules";
import { useState } from "react";
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from "../Monaco";

export const AutopilotEditor = ({ data, rules, rulesCode, setRulesCode, value, valueReady = true, onAddRule = (e, rule) => { }, onDeleteRule = (index) => { } }) => {
    const [tab, setTab] = useState("rules");
    const { resolvedTheme } = useThemeSetting();
    return (
        <PanelGroup direction="horizontal">
            <Panel>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={66} minSize={20} maxSize={80}>
                        <YStack
                            flex={1}
                            height="100%"
                            borderRadius="$3"
                            p="$3"
                            backgroundColor="$gray3"
                            overflow="hidden"
                        >
                            <ScrollView
                                flex={1}
                                width="100%"
                                height="100%"
                                overflow="auto"
                            >
                                <Tinted>
                                    <p>Input</p>
                                    <div style={{ minWidth: "600px" }}>
                                        <JSONViewer key={JSON.stringify(data)} collapsible data={data} />
                                    </div>
                                </Tinted>
                            </ScrollView>
                        </YStack>
                    </Panel>

                    <CustomPanelResizeHandle direction="horizontal" />

                    <Panel defaultSize={34} minSize={20} maxSize={80}>
                        <YStack
                            flex={1}
                            height="100%"
                            borderRadius="$3"
                            p="$3"
                            backgroundColor="$gray3"
                            overflow="hidden"
                        >
                            <ScrollView
                                flex={1}
                                width="100%"
                                height="100%"
                                overflow="auto"
                            >
                                <Tinted>
                                    <p>Output</p>
                                    {valueReady && <div style={{ minWidth: "600px" }}>
                                        <JSONViewer key={JSON.stringify(value)} collapsible data={value} />
                                    </div>}
                                    {!valueReady && <Spinner />}
                                </Tinted>
                            </ScrollView>
                        </YStack>
                    </Panel>
                </PanelGroup>
            </Panel>

            <CustomPanelResizeHandle direction="vertical" />


            {/* Panel derecho */}
            <Panel defaultSize={60} minSize={50}>
                <YStack
                    flex={1}
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$gray3"
                    borderRadius="$3"
                    p="$3"
                >
                    <XStack width={"100%"} pt="$0" pr="$1" pb="$2" jc="center">
                        <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                            <ToggleGroup.Item value="rules">rules</ToggleGroup.Item>
                            <ToggleGroup.Item value="code">code</ToggleGroup.Item>
                        </ToggleGroup>
                    </XStack>
                    <Tinted>
                        {(tab == 'rules' || !tab) && <Rules
                            rules={rules}
                            onAddRule={onAddRule}
                            onDeleteRule={onDeleteRule}
                            loadingIndex={-1}
                        />}
                        {tab == 'code' && <Monaco
                            path={'rules.ts'}
                            darkMode={resolvedTheme === 'dark'}
                            sourceCode={rulesCode}
                            onChange={setRulesCode}
                        />}
                    </Tinted>
                </YStack>
            </Panel>
        </PanelGroup>
    );
};
