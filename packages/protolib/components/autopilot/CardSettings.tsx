import { BookOpenText, ExternalLink, Palette, Type } from '@tamagui/lucide-icons'
import { YStack, XStack, Input, Label, Text } from '@my/ui'
import { InputColor } from '../InputColor'
import { InteractiveIcon } from '../InteractiveIcon'
import { IconSelect } from '../IconSelect'
import { useState } from 'react'

export const CardSettings = ({ cardData, setCardData, icons }) => {

    const [error, setError] = useState(null)
    return <XStack alignItems="center" space="$6" width="100%" >
        <YStack flex={1} w={400} >
            <XStack ai={"center"}>
                <Label ml={"$2"} h={"$3.5"} size={"$5"}> <Type color={"$color8"} mr="$2" />Title</Label>
                {error?<Text color={"$red9"} fontSize={"$1"} ml={"$3"}>{error}</Text>:<></>}
            </XStack>
            <Input
                br={"8px"}
                value={cardData.name}
                color={error?'$red9':null}
                onChange={(e) =>{
                    const regex = /^[a-zA-Z0-9-_ ]*$/;
                    if (regex.test(e.target.value)) {
                        setError(null);
                    }else{
                        setError("Invalid input, only letters, numbers, spaces, - and _ are allowed.");
                    }
                    setCardData({
                            ...cardData,
                            name: e.target.value,
                    })    
                }
                }
            />
        </YStack>
        <YStack flex={1} w={400}>
            <Label ml={"$2"} h={"$3.5"} size={"$5"}><BookOpenText color={"$color8"} mr="$2" />Icon</Label>
            <IconSelect
                br={"8px"}
                icons={icons}
                onSelect={(icon) => {
                    setCardData({
                        ...cardData,
                        icon,
                    });
                }}
                selected={cardData.icon}
            />
        </YStack>
        <YStack flex={1} w={400}>
            <Label ml={"$2"} h={"$3.5"} size={"$5"}><Palette color={"$color8"} mr="$2" />Color</Label>
            <InputColor
                br={"8px"}
                color={cardData.color}
                onChange={(e) =>
                    setCardData({ ...cardData, color: e.hex })
                }
            />
        </YStack>
    </XStack>

}