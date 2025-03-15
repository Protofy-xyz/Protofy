import { BookOpenText, ExternalLink, Cog, Palette, Type } from '@tamagui/lucide-icons'
import { YStack, XStack, Input, Label } from '@my/ui'
import { useEffect, useState } from 'react'
import { Tinted } from '../../components/Tinted'
import { InputColor } from '../../components/InputColor'
import { InteractiveIcon } from '../../components/InteractiveIcon'
import { IconSelect } from '../../components/IconSelect'
import { RuleEditor } from './RuleEditor'


export const ValueCardSettings = ({ states, card, icons, onEdit = (data) => { } }) => {
    const [cardData, setCardData] = useState(card);

    useEffect(() => {
        onEdit(cardData);
    }, [cardData, onEdit]);

    return (
        <YStack space="$4" padding="$4">
            <Tinted>
                <XStack alignItems="center" space="$8" width="100%">
                    <YStack flex={1}>
                        <Label size={"$5"}> <Type color={"$color8"} mr="$2" />Title</Label>
                        <Input
                            value={cardData.name}
                            onChange={(e) =>
                                setCardData({
                                    ...cardData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </YStack>
                    <YStack flex={1}>
                        <XStack alignItems="center" space="$2">
                            <Label size={"$5"}><BookOpenText color={"$color8"} mr="$2" />Icon</Label>

                        </XStack>
                        <XStack alignItems="center" space="$2">
                            <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer">
                                <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
                            </a>
                            <IconSelect
                                icons={icons}
                                onSelect={(icon) => {
                                    setCardData({
                                        ...cardData,
                                        icon,
                                    });
                                }}
                                selected={cardData.icon}
                            />
                        </XStack>

                    </YStack>
                    <YStack flex={1}>
                        <Label size={"$5"}><Palette color={"$color8"} mr="$2" />Color</Label>
                        <InputColor
                            color={cardData.color}
                            onChange={(e) =>
                                setCardData({ ...cardData, color: e.hex })
                            }
                        />
                    </YStack>
                </XStack>

                <YStack mt="$5" height={600}>
                    <Label mb="$-3" size={"$5"}><Cog color={"$color8"} mr="$2"></Cog>Value</Label>
                    <RuleEditor
                        states={states}
                        cardData={cardData}
                        setCardData={setCardData}
                    />
                </YStack>
            </Tinted>
        </YStack>
    );
};