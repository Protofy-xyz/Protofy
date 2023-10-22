import { Paragraph, XStack, YStack, YStackProps } from "tamagui"
import { Tinted } from "./Tinted"

export const CardBody = ({title=null, extra=null, description=null, descriptionExtra=null, ...props}: any & YStackProps) => {
    return <YStack px={"$5"} f={1}>
        <XStack f={1}>
            <Tinted>
                <XStack f={1}>
                    {title}
                </XStack>
                <XStack>
                    {extra}
                </XStack>
            </Tinted>
        </XStack>
        {(description || descriptionExtra) && <XStack mt="$2" f={1}>
            <YStack f={1}>
                {description}
            </YStack>
            <XStack>
                {descriptionExtra}
            </XStack>
        </XStack>}
    </YStack>
}