import { BookOpenText, ExternalLink, Palette, Type } from '@tamagui/lucide-icons'
import { YStack, XStack, Input, Label } from '@my/ui'
import { InputColor } from '../InputColor'
import { InteractiveIcon } from '../InteractiveIcon'
import { IconSelect } from '../IconSelect'

export const CardSettings = ({ cardData, setCardData, icons }) => {

    return <XStack alignItems="center" space="$8" width="100%" mt="$-6">
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

}