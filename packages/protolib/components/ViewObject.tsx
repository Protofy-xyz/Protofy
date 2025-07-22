import { Info, X, Trash2 } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'
import { Button, Input, Paragraph, SizableText, View, XStack, YStack } from 'tamagui'

export function ViewObject({
    object = {},
    onKeyEdit = (oldKey, newKey) => { },
    onValueEdit = (key, newValue) => { },
    onKeyDelete = (key) => { },
    onAdd = (key, value) => { },
    onClear = () => { },
}) {
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')
    const [entries, setEntries] = useState(Object.entries(object))

    useEffect(() => {
        setEntries(Object.entries(object))
    }, [object])

    const handleAdd = () => {
        if (!newKey || entries.some(([k]) => k === newKey)) return
        onAdd(newKey, newValue)
        setNewKey('')
        setNewValue('')
    }

    return (
        <YStack className="no-drag" height="100%" f={1} p="$3" gap="$2">
            {entries.length ? (
                <YStack f={1}>
                    <XStack jc="space-between" ai="center">
                        <Button icon={Trash2} chromeless onPress={onClear}>
                            <SizableText mr="$2">Clear all</SizableText>
                        </Button>
                        <SizableText fontWeight="500" o={0.8}>
                            Total: {entries.length}
                        </SizableText>
                    </XStack>

                    {entries.map(([key, value], index) => (
                        <XStack key={index} ai="center" gap="$2" p="$2" br="$4">
                            <Input
                                value={key}
                                flex={1}
                                readOnly={true}
                                // onChangeText={(text) => {
                                //     const newKey = text
                                //     if (newKey && newKey !== key && object[newKey] === undefined) {
                                //         onKeyEdit(key, newKey)
                                //     }
                                // }}
                            />
                            <Input
                                value={value}
                                flex={1}
                                readOnly={true}
                                // onChangeText={(text) => {
                                //     const newVal = text
                                //     if (newVal !== value) {
                                //         onValueEdit(key, newVal)
                                //     }
                                // }}
                            />
                            <Button chromeless onPress={() => onKeyDelete(key)}>
                                <X color="$red10" />
                            </Button>
                        </XStack>
                    ))}
                </YStack>
            ) : (
                <YStack jc="center" ai="center" height="100%" f={1}>
                    <Info color="$color7" size={50} />
                    <Paragraph mt="$4" fontSize="$8" fontWeight="600" color="$color">
                        Empty object
                    </Paragraph>
                </YStack>
            )}

            <XStack mt="$4" gap="$2">
                <Input flex={1} value={newKey} onChangeText={setNewKey} placeholder="New key" />
                <Input flex={1} value={newValue} onChangeText={setNewValue} placeholder="New value" />
                <Button disabled={!newKey} onPress={handleAdd}>
                    <SizableText>Add</SizableText>
                </Button>
            </XStack>
        </YStack>
    )
}