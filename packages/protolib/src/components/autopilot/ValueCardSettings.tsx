import { Braces, Monitor, ClipboardList, Sliders } from '@tamagui/lucide-icons'
import { YStack, XStack, ToggleGroup, ScrollView, Text } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { CardSettings } from './CardSettings'
import { HTMLEditor } from './HTMLEditor'
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from '../Monaco'
import { ParamsEditor } from './ParamsEditor'


export const ValueCardSettings = ({ states, card, icons, onEdit = (data) => { } }) => {
    const [cardData, setCardData] = useState(card);
    const [tab, setTab] = useState("rules");
    const { resolvedTheme } = useThemeSetting();

    useEffect(() => {
        onEdit(cardData);
    }, [cardData, onEdit]);

    const setHTMLCode = (code) => {
        setCardData({
            ...cardData,
            html: code,
        })
    }

    return (
        <ScrollView space="$4" padding="$4" mah={"70vh"}>
            <Tinted>
                <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />
                <YStack height={650} pb="$-5">
                    <XStack m="$5" width={"100%"} pt="$0" pr="$1" mt={"$8"} jc="center">
                        {/* @ts-ignore */}
                        <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                            <ToggleGroup.Item value="rules">
                                <XStack gap={"$2"} ai={"center"}>
                                    <ClipboardList size={"$1"} />
                                    <Text>Value</Text>
                                </XStack >
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="params">
                                <XStack gap={"$2"} ai={"center"}>
                                    <Sliders size={"$1"} />
                                    <Text>Params</Text>
                                </XStack >
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="view">
                                <XStack gap={"$2"} ai={"center"}>
                                    <Monitor size={"$1"} />
                                    <Text>Display</Text>
                                </XStack >
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="raw">
                                <XStack gap={"$2"} ai={"center"}>
                                    <Braces size={"$1"} />
                                    <Text>Raw</Text>
                                </XStack >
                            </ToggleGroup.Item>
                        </ToggleGroup>
                    </XStack>
                    <Tinted>
                        {(tab == 'rules' || !tab) && <RuleEditor
                            displayInput={states}
                            onCodeChange={(cardData, states) => {
                                console.log('new rules code, executing...', cardData, states)
                                const wrapper = new Function('states', `
                              ${cardData.rulesCode}
                            `);
                                let value = wrapper(states);
                                return value
                            }}
                            compiler='getValueCode'
                            states={states}
                            cardData={cardData}
                            setCardData={setCardData}
                        />}
                        {tab == 'params' && <ParamsEditor
                            mode={'value'}
                            params={cardData.params || {}}
                            setParams={(newParams) => {
                                console.log("hacemos setParams", newParams)
                                setCardData((prev) => ({
                                    ...prev,
                                    params: newParams,
                                }))
                            }}
                        />}
                        {tab == 'view' && <HTMLEditor setHTMLCode={setHTMLCode} htmlCode={cardData.html} data={{ ...cardData, icon: cardData.icon, color: cardData.color, name: cardData.name, value: card.value }} />}
                        {tab == 'raw' && <Monaco
                            path={"card-" + cardData.name + ".ts"}
                            darkMode={resolvedTheme === 'dark'}
                            sourceCode={JSON.stringify(cardData, null, 2)}
                            onChange={(newCode) => {
                                try {
                                    setCardData(JSON.parse(newCode))
                                } catch (err) {
                                    console.error("Invalid JSON", err)
                                }
                            }}
                            options={{
                                scrollBeyondLastLine: false,
                                scrollbar: {
                                    vertical: 'auto',
                                    horizontal: 'auto',
                                },
                                folding: false,
                                lineDecorationsWidth: 0,
                                lineNumbersMinChars: 0,
                                minimap: { enabled: false },
                                formatOnPaste: true,
                                formatOnType: true,
                            }}
                        />}
                    </Tinted>

                </YStack>
            </Tinted>
        </ScrollView>
    );
};