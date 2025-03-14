import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView, Spinner } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import JSONViewer from "../jsonui/JSONViewer";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Rules } from "./Rules";

export const AutopilotEditor = ({ data, rules, value, valueReady=true, onAddRule=(e,rule)=>{}, onDeleteRule=(index) => {}}) => {
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
                            backgroundColor="$gray2"
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
                            backgroundColor="$gray2"
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
                    <Tinted>
                        <Rules
                            rules={rules}
                            onAddRule={onAddRule}
                            onDeleteRule={onDeleteRule}
                            loadingIndex={-1}
                        />
                    </Tinted>
                </YStack>
            </Panel>
        </PanelGroup>
    );
};
