import { Cog } from '@tamagui/lucide-icons'
import { YStack, XStack, Label, ToggleGroup, Input } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { CardSettings } from './CardSettings'
import { HTMLEditor } from './HTMLEditor'


export const ValueCardSettings = ({ states, card, icons, onEdit = (data) => { } }) => {
    const [cardData, setCardData] = useState(card);
    const [tab, setTab] = useState("rules");

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
        <YStack space="$4" padding="$4">
            <Tinted>
                <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />
                <YStack mt="$5" height={600}>
                    <Label mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Value</Label>
                    <XStack width={"100%"} pt="$0" pr="$1" pb="$2" jc="center">
                        <ToggleGroup disableDeactivation={true} height="$3" type="single" value={tab} onValueChange={setTab}>
                            <ToggleGroup.Item value="rules">rules</ToggleGroup.Item>
                            <ToggleGroup.Item value="view">view</ToggleGroup.Item>
                        </ToggleGroup>
                    </XStack>
                    <Tinted>
                        {(tab == 'rules' || !tab) && <RuleEditor
                            displayInput={states}
                            onCodeChange={(cardData, states) => {
                                console.log('new rules code, executing...', cardData, states)
                                const wrapper = new Function('states', `
                              ${cardData.rulesCode}
                              return reduce_state_obj(states);
                            `);
                                let value = wrapper(states);
                                return value
                            }}
                            compiler='getValueCode'
                            states={states}
                            cardData={cardData}
                            setCardData={setCardData}
                        />}
                        {tab == 'view' && <HTMLEditor setHTMLCode={setHTMLCode} htmlCode={cardData.html}/>}
                    </Tinted>

                </YStack>
            </Tinted>
        </YStack>
    );
};