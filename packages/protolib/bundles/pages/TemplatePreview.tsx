import { NextLink } from 'protolib'
import { Paragraph, XStack, YStack } from '@my/ui'
import { useState } from 'react'
import { Tinted } from '../../components/Tinted'
import { Button, Image } from 'tamagui'

export default ({ template, isSelected, onPress, theme }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const templateUrl = `https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/${template}-${theme}.png`
    let height = 120 * 1.5
    let width = 238 * 1.5
    return (
        <Tinted>
            <YStack id={"pages-template-" + template} onPress={onPress} onHoverIn={() => setPreviewVisible(true)} onHoverOut={() => setPreviewVisible(false)} overflow='hidden' borderWidth={isSelected ? "$1" : "$0.5"} borderColor={isSelected ? "$color7" : "$gray8"} cursor='pointer' borderRadius={"$3"}>
                <Image
                    source={{ height: height, width: width, uri: templateUrl }}
                />
                <YStack
                    display={previewVisible ? 'block' : 'none'}
                    zi={10000}
                    position='absolute'
                    right={"$2"}
                    top={"$2"}
                >
                    <NextLink target="_blank" href={templateUrl}>
                        <Button
                            backgroundColor={"$color7"}
                            size="$1.5" borderRadius={"$1"}
                            px="$2" textProps={{ size: "$1" }}
                            onPress={(e) => {
                                e.stopPropagation()
                            }}
                        // iconAfter={<Eye size="$1" color="$color7" />}
                        >preview</Button>
                    </NextLink>
                </YStack>
                <XStack jc='space-between' borderTopWidth={"$0.5"} borderColor={"$gray8"} backgroundColor={"$gray3"} py="$1" px="$2">
                    <Paragraph>{template}</Paragraph>
                </XStack>
            </YStack>
        </Tinted>
    )
}
