import { BookOpenText, ExternalLink, Palette, Type } from '@tamagui/lucide-icons'
import { YStack, XStack, Input, Label, Text } from '@my/ui'
import { InputColor } from '../InputColor'
import { IconSelect } from '../IconSelect'
import { useState } from 'react'

export const SettingsTitle = ({ children, error = "" }) => {
    return <XStack ai={"center"}>
        <Label ml={"$3"} h={"$3.5"} color="$gray9" size="$5">
            {children}
        </Label>
        {error ? <Text color={"$red9"} fontSize={"$1"} ml={"$3"}>{error}</Text> : <></>}
    </XStack>
}

export const CardSettings = ({ cardData, setCardData }) => {

    const [error, setError] = useState(null)
    return <XStack alignItems="center" space="$6" width="100%" >
        <YStack flex={1} maw={400} >
            <SettingsTitle error={error}>
                Name <Text color={"$color8"}>*</Text>
            </SettingsTitle>
            <Input
                br={"8px"}
                value={cardData.name}
                color={error?'$red9':null}
                onChangeText={(t) =>{
                    const regex = /^[a-zA-Z0-9-_ ]*$/;
                    if (regex.test(t)) {
                        setError(null);
                    }else{
                        //setError("Invalid input, only letters, numbers, spaces, - and _ are allowed.");
                    }
                    setCardData({
                            ...cardData,
                            name: t,
                    })    
                }
                }
            />
        </YStack>
    </XStack>

}