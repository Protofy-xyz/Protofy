import { Cog } from '@tamagui/lucide-icons'
import { YStack, Label } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../Tinted'
import { RuleEditor } from './RuleEditor'
import { CardSettings } from './CardSettings'


export const ValueCardSettings = ({ states, card, icons, onEdit = (data) => { } }) => {
    const [cardData, setCardData] = useState(card);

    useEffect(() => {
        onEdit(cardData);
    }, [cardData, onEdit]);

    return (
        <YStack space="$4" padding="$4">
            <Tinted>
            <CardSettings cardData={cardData} setCardData={setCardData} icons={icons} />
                <YStack mt="$5" height={600}>
                    <Label mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Value</Label>
                    <RuleEditor
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
                    />
                </YStack>
            </Tinted>
        </YStack>
    );
};