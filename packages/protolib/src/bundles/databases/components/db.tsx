import { YStack, XStack, Stack, Paragraph, Text, Button, Input } from '@my/ui'
import { API } from 'protobase';
import { DataCard } from '../../../components/DataCard';
import { Search } from '../../../components/Search';
import { Popover } from '../../../components/Popover';
import { Tinted } from '../../../components/Tinted';

import { useUpdateEffect } from 'usehooks-ts'
import { useSearchParams } from 'solito/navigation';
import { useState } from 'react'
import { Plus } from '@tamagui/lucide-icons'

export default function DBAdmin({ contentState }) {
    const searchParams = useSearchParams();
    const query = Object.fromEntries(searchParams.entries());
    
    const currentDB = query.name ? query.name[2] : undefined;

    const [content, setContent] = useState(contentState.data.entries)
    const [renew, setRenew] = useState(1)
    const [originalContent, setOriginalContent] = useState<any>()

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [error, setError] = useState(false)
    const [newKey, setNewKey] = useState('')
    const emptyItemValue = { exapmle: "exampleValue" }
    const [tmpItem, setTmpItem] = useState<string | null>(null)

    // usePendingEffect(async () => {
    //     const databases = await API.get('/api/core/v1/databases')
    //     setDatabases(databases)
    //     if (databases?.isLoaded && databases?.data.length) {
    //         API.get('/api/core/v1/databases/' + currentDB, setContent)
    //     }
    // }, databases)
    useUpdateEffect(() => {
        console.log('refreshing database content')
        API.get('/api/core/v1/databases/' + currentDB, setContent)
    }, [currentDB])

    const onDelete = async (key, isTemplate) => {
        if (isTemplate) {
            setTmpItem(null)
            content.data.shift()
        } else {
            const result = await API.get('/api/core/v1/databases/' + currentDB + '/' + key + '/delete')
            if (result?.isLoaded && result.data.result == 'deleted') {
                content.data = content.data.filter((l) => l.key != key)
            }
        }
        setContent({ ...content })
    }
    const onCreateItem = () => {
        const keyExist = content.data.find(i => i.key == newKey)
        if (keyExist || !newKey) return setError(true)
        const newTmpItem = { key: newKey, value: emptyItemValue }
        content.data.unshift(newTmpItem)
        setTmpItem(newKey)
        setContent({ ...content })
        setIsPopoverOpen(false)
        setNewKey("")
    }
    const onSave = async (newContent, key) => {
        const result = await API.post('/api/core/v1/databases/' + currentDB + '/' + key, newContent)
        if (result?.isLoaded) {
            setContent({
                ...content,
                data: content?.data?.map(x => x.key === key ? { key: key, value: result?.data } : x)
            }
            )
            setRenew(renew + 1)
        }
        setTmpItem(null)
        return result
    }

    const onSearch = async (text) => {
        if (!originalContent) setOriginalContent(content)
        API.post('/api/core/v1/dbsearch/' + currentDB, { search: text }, setContent)
    }

    const onCancelSearch = async () => {
        setContent(originalContent)
    }

    return (
        <YStack f={1}>
            <XStack py="$4" px="$5">
                <YStack f={1}>
                    <Paragraph>
                        <Text fontSize="$5">{currentDB}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text o={0.5}>[total: {content?.data?.length}]</Text>
                    </Paragraph>
                </YStack>

                <XStack gap="$2">
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />

                    {!tmpItem
                        ?
                        <Tinted>
                            <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen} trigger={
                                <Button
                                    hoverStyle={{ o: 1 }} o={0.7}
                                    size="$3"
                                    chromeless
                                    circular
                                    noTextWrap
                                    onPress={() => setIsPopoverOpen(!isPopoverOpen)}
                                    theme={isPopoverOpen ? 'alt1' : undefined}
                                >
                                    <Plus style={{ alignSelf: 'center' }} opacity={0.5} color="var(--color)" />
                                </Button>
                            }
                            >
                                <YStack padding={'$6'} gap='$6'>
                                    <Text w={'$16'}>{'Please enter a unique key for the new DB item.'}</Text >
                                    <Input
                                        placeholder='Enter new item key'
                                        onChangeText={text => { setNewKey(text); setError(false) }}
                                        value={newKey}
                                        color={error ? '$red10' : ''}
                                        onSubmitEditing={onCreateItem}
                                    ></Input>
                                    <Tinted>
                                        <Button hoverStyle={{ bc: '$color8' }} disabled={error} onPress={onCreateItem} backgroundColor={error ? '$red10' : '$color9'} >
                                            <Text color={"white"}>{error ? "Item already exists" : "Create"}</Text>
                                        </Button>
                                    </Tinted>

                                </YStack>
                            </Popover>
                        </Tinted>
                        : null}
                </XStack>
            </XStack>

            <XStack flexWrap='wrap'>
                {content?.data?.map((element, i) => {
                    return (
                        <Stack key={element.key} p={"$5"}>
                            <DataCard
                                innerContainerProps={{
                                    maxWidth: 700,
                                    $md: { maxWidth: 450 },
                                    $sm: { minWidth: 'calc(100vw - 65px)', maxWidth: 'calc(100vw - 65px)' },
                                    minWidth: 300
                                }}
                                onDelete={onDelete}
                                key={renew}
                                onSave={(content) => onSave(content, element.key)}
                                json={element.value}
                                name={element.key}
                                isTemplate={element.key == tmpItem}
                            />
                        </Stack>
                    )
                })}
            </XStack>
        </YStack>

    )
}