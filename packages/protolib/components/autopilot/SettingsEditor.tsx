import { YStack, XStack, Label, Input, Checkbox } from '@my/ui'
import { Check } from 'lucide-react'
import { Monaco } from '../Monaco'
import { v4 as uuidv4 } from 'uuid';

export const SettingsEditor = ({
    card,
    cardData,
    setCardData,
    resolvedTheme,
}: {
    card: any
    cardData: any
    setCardData: (data: any) => void
    resolvedTheme: string
}) => {
    const getChecked = (key: string) => cardData[key] !== false

    const handleCheckboxChange = (key: string) => (checked: boolean) => {
        setCardData({ ...cardData, [key]: checked })
    }

    const renderCheckbox = (label: string, key: string, checked?, onCheckedChange?) => (
        <XStack ai="center" gap="$2">
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
        <XStack f={1} gap="$4">
            <YStack gap="$1" w={300}>
                <XStack ai="center" gap="$2">
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
                    <>
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
                    </>
                )}
            </YStack>

            <YStack f={1}>
                <Monaco
                    path={`card-${cardData.name}.ts`}
                    darkMode={resolvedTheme === 'dark'}
                    sourceCode={JSON.stringify(cardData, null, 2)}
                    onChange={(newCode) => {
                        try {
                            setCardData(JSON.parse(newCode))
                        } catch (err) {
                            console.error('Invalid JSON', err)
                        }
                    }}
                    options={{
                        scrollBeyondLastLine: false,
                        scrollbar: { vertical: 'auto', horizontal: 'auto' },
                        folding: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 0,
                        minimap: { enabled: false },
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                />
            </YStack>
        </XStack>
    )
}
