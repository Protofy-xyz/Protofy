import { YStack, XStack, Label, Input, Checkbox } from '@my/ui'
import { Check } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { SettingsTitle } from './CardSettings';
import { IconSelect } from '../IconSelect';
import { InputColor } from '../InputColor';

export const DisplayEditor = ({
    card,
    cardData,
    setCardData,
    icons
}: {
    card: any
    cardData: any
    icons: any
    setCardData: (data: any) => void
}) => {
    const cellWidth = 400
    const cellHeight = 50
    const getChecked = (key: string) => cardData[key] !== false

    const handleCheckboxChange = (key: string) => (checked: boolean) => {
        setCardData({ ...cardData, [key]: checked })
    }

    const renderCheckbox = (label: string, key: string, checked?, onCheckedChange?) => (
        <XStack ai="center" gap="$2" w={cellWidth} h={cellHeight}>
            <Checkbox
                w="$2"
                h="$2"
                focusStyle={{ outlineWidth: 0 }}
                checked={checked ?? getChecked(key)}
                onCheckedChange={onCheckedChange ?? handleCheckboxChange(key)}
                className="no-drag"
            >
                <Checkbox.Indicator>
                    <Check size={16} />
                </Checkbox.Indicator>
            </Checkbox>
            <Label>{label}</Label>
        </XStack>
    )

    return (
        <YStack f={1} gap="$4">
            <XStack space="$4" flexWrap='wrap'>
                <YStack w={400}>
                    <SettingsTitle>
                        Icon
                    </SettingsTitle>
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
                <YStack w={400}>
                    <SettingsTitle>
                        Color
                    </SettingsTitle>
                    <InputColor
                        br={"8px"}
                        color={cardData.color}
                        onChange={(e) =>
                            setCardData({ ...cardData, color: e.hex })
                        }
                    />
                </YStack>
            </XStack>
            <YStack>
                <SettingsTitle>
                    Config
                </SettingsTitle>
                <XStack space="$2" flexWrap='wrap'>
                    <XStack ai="center" gap="$2" w={cellWidth} h={cellHeight}>
                        <Checkbox
                            w="$2"
                            h="$2"
                            focusStyle={{ outlineWidth: 0 }}
                            checked={Object.keys(cardData.tokens ?? {}).length > 0}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setCardData({
                                        ...cardData, tokens: {
                                            'read': uuidv4(),
                                            'run': uuidv4()
                                        }
                                    })
                                } else {
                                    const { tokens, ...rest } = cardData
                                    setCardData(rest)
                                }
                            }}
                            className="no-drag"
                        >
                            <Checkbox.Indicator>
                                <Check size={16} />
                            </Checkbox.Indicator>
                        </Checkbox>
                        <Label>API access</Label>
                    </XStack>
                    {card.type === 'action' && renderCheckbox('Keep value permanently', 'persistValue', cardData.persistValue ? true : false)}
                    {renderCheckbox('Display title', 'displayTitle')}
                    {renderCheckbox('Display icon', 'displayIcon')}
                    {renderCheckbox('Display frame', 'displayFrame')}
                    {renderCheckbox('Markdown display', 'markdownDisplay', cardData.markdownDisplay ? true : false)}
                    {card.type === 'action' && (
                        <YStack>
                            {renderCheckbox('Display value', 'displayResponse')}
                            {renderCheckbox('Display button', 'displayButton')}

                            {getChecked('displayButton') && (
                                <YStack ai="flex-start" ml="$6" ac="flex-start">
                                    <Input
                                        outlineColor="$colorTransparent"
                                        id="button-text-input"
                                        size="$4"
                                        placeholder="Button text"
                                        value={cardData.buttonLabel ?? 'Run'}
                                        onChangeText={(value) => {
                                            setCardData({ ...cardData, buttonLabel: value })
                                        }}
                                        className="no-drag"
                                    />
                                    {renderCheckbox('Button Full', 'buttonMode', cardData.buttonMode === 'full', (checked: boolean) => {
                                        let newData = { ...cardData }
                                        if (checked) {
                                            newData.buttonMode = 'full'
                                        } else {
                                            delete newData.buttonMode
                                        }
                                        setCardData({ ...newData })
                                    })}
                                    {renderCheckbox('Display icon', 'displayButtonIcon', cardData.displayButtonIcon === true)}
                                </YStack>
                            )}
                        </YStack>
                    )}
                </XStack>
            </YStack>
        </YStack>
    )
}
