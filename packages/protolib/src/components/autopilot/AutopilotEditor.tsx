import { Panel, PanelGroup } from "react-resizable-panels";
import { YStack, ScrollView } from "@my/ui";
import { Tinted } from "../../components/Tinted";
import JSONViewer from "../jsonui/JSONViewer";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";

export const AutopilotEditor = ({ data }) => {
    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={33} minSize={20} maxSize={50}>
                <YStack 
                    flex={1} 
                    height="100%" 
                    borderRadius="$3" 
                    p="$3" 
                    backgroundColor="$gray2" 
                    overflow="hidden"
                >
                    <ScrollView flex={1} width="100%" height="100%">
                        <Tinted>
                            <JSONViewer collapsible data={data} />
                        </Tinted>
                    </ScrollView>
                </YStack>
            </Panel>

            <CustomPanelResizeHandle direction="vertical" />

            <Panel defaultSize={67} minSize={50}>
                <YStack
                    flex={1}
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$gray3"
                    borderRadius="$3"
                    p="$3"
                >
                    {/* Content rigth panel */}
                </YStack>
            </Panel>
        </PanelGroup>
    );
};
