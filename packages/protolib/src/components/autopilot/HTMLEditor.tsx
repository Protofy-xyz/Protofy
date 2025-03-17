import { Input, Label, XStack, YStack } from "@my/ui";
import CustomPanelResizeHandle from "../MainPanel/CustomPanelResizeHandle";
import { Panel, PanelGroup } from "react-resizable-panels";
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from "../Monaco";
import { useEffect, useState } from "react";

export const HTMLEditor = ({ htmlCode, setHTMLCode }) => {
    const [code, setCode] = useState(htmlCode);

    useEffect(() => {
        setCode(htmlCode);
    }, [htmlCode]);

    const { resolvedTheme } = useThemeSetting();
    const [value, setValue] = useState('example');

    const getHTML = (code) => {
        try {
            const wrapper = new Function('value', `
            ${code}
        `);
            return wrapper(value);
        } catch (e) {
            console.error(e);
        }
        return '';
    }

    return (
        <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={50}>
                <YStack
                    flex={1}
                    height="100%"
                    alignItems="center"
                    backgroundColor="$gray3"
                    borderRadius="$3"
                    p="$3"
                    justifyContent="flex-start"
                >
                    <div dangerouslySetInnerHTML={{ __html: getHTML(code) }} />
                    <XStack style={{ marginTop: 'auto' }}>
                        <Label size={"$5"} mr={"$10"}>Value Example</Label>
                        <Input
                            value={value}
                            onChangeText={(newValue) =>{ setValue(newValue)}}
                        />
                    </XStack>
                </YStack>
            </Panel>
            <CustomPanelResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={50}>
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
                        path={'rules.ts'}
                        darkMode={resolvedTheme === 'dark'}
                        sourceCode={htmlCode}
                        onChange={(newCode) => {setCode(newCode); setHTMLCode(newCode)}}
                    />
                </YStack>
            </Panel>
        </PanelGroup>
    );
};
