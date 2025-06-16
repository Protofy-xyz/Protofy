import { Input, Label, XStack, YStack } from "@my/ui";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Panel, PanelGroup } from "react-resizable-panels";
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from "../Monaco";
import { useEffect, useState } from "react";
import { HTMLView } from "@extensions/services/widgets";

export const HTMLEditor = ({ htmlCode, setHTMLCode, data }) => {
    const [code, setCode] = useState(htmlCode);

    useEffect(() => {
        setCode(htmlCode);
    }, [htmlCode]);

    const { resolvedTheme } = useThemeSetting();

    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={50}>
                <YStack
                    flex={1}
                    height="100%"
                    alignItems="center"
                    backgroundColor="$gray3"
                    borderRadius="$3"
                    p="$3"
                    justifyContent="flex-start"
                >
                    <HTMLView html={code} data={data} />
                </YStack>
            </Panel>
            <CustomPanelResizeHandle direction="vertical" />
            <Panel defaultSize={50}>
                <YStack
                    flex={1}
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="$gray3"
                    borderRadius="$3"
                    p="$3"
                >
                    <Monaco
                        path={'html-rules-' + data.name + '.ts'}
                        darkMode={resolvedTheme === 'dark'}
                        sourceCode={htmlCode}
                        onChange={(newCode) => { setCode(newCode); setHTMLCode(newCode) }}
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
    );
};
