import { Cog } from '@tamagui/lucide-icons'
import { YStack, XStack, Label, ToggleGroup, ScrollView, Paragraph, Switch } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { CardSettings } from './CardSettings'
import { HTMLEditor } from './HTMLEditor'
import { useThemeSetting } from '@tamagui/next-theme';
import { Monaco } from '../Monaco'


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
                <YStack mt="$5" height={650} pb="$-5">
                    <Label mt="$-2" mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Value</Label>
                    <XStack width={"100%"} pt="$0" pr="$1" pb="$2" jc="center">
                        <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                            <ToggleGroup.Item value="rules">Value</ToggleGroup.Item>
                            <ToggleGroup.Item value="view">Display</ToggleGroup.Item>
                            <ToggleGroup.Item value="raw">Raw</ToggleGroup.Item>
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