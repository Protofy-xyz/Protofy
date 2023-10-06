import { YStack, XStack, Stack, Paragraph, Text, Button, Input } from 'tamagui'
import { useAtom, API, createApiAtom, DataCard, Search, Popover } from 'protolib'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Plus } from '@tamagui/lucide-icons'

const contentAtom = createApiAtom([])

export default function DBAdmin({ contentState }) {
    const router = useRouter()

    const [content, setContent] = useAtom(contentAtom, contentState)
    const currentDB = router.query.name
    const [renew, setRenew] = useState(1)
    const [originalContent, setOriginalContent] = useState<any>()

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [error, setError] = useState(false)
    const [newKey, setNewKey] = useState('')
    const emptyItemValue = { exapmle: "exampleValue" }
    const [tmpItem, setTmpItem] = useState({})

    // usePendingEffect(async () => {
    //     const databases = await API.get('/adminapi/v1/databases')
    //     setDatabases(databases)
    //     if (databases?.isLoaded && databases?.data.length) {
    //         API.get('/adminapi/v1/databases/' + currentDB, setContent)
    //     }
    // }, databases)
    useUpdateEffect(() => {
        console.log('refreshing database content')
        API.get('/adminapi/v1/databases/' + currentDB, setContent)
    }, [currentDB])

    const onDelete = async (key, isTemplate) => {
        if (isTemplate) {
            setTmpItem({})
            content.data.shift()
        } else {
            const result = await API.get('/adminapi/v1/databases/' + currentDB + '/' + key + '/delete')
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
        setTmpItem(newTmpItem)
        setContent({ ...content })
        setIsPopoverOpen(false)
        setNewKey("")
    }
    const onSave = async (newContent, key) => {
        const result = await API.post('/adminapi/v1/databases/' + currentDB + '/' + key, newContent)
        if (result?.isLoaded) {
            setContent({
                ...content,
                data: content?.data?.map(x => x.key === key ? { key: key, value: result?.data } : x)
            }
            )
            setRenew(renew + 1)
        }
        setTmpItem({})
        return result
    }

    const onSearch = async (text) => {
        if (!originalContent) setOriginalContent(content)
        API.post('/adminapi/v1/dbsearch/' + currentDB, { search: text }, setContent)
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

                <XStack>
                    <Search onCancel={onCancelSearch} onSearch={onSearch} />

                    {Object.keys(tmpItem).length == 0
                        ?
                        <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen} trigger={
                            <Button
                                size="$3"
                                chromeless
                                circular
                                hoverStyle={{
                                    //@ts-ignore
                                    bc: 'transparent',
                                }}

                                noTextWrap
                                //@ts-ignore
                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                theme={isPopoverOpen ? 'alt1' : undefined}
                            >
                                <Plus style={{ alignSelf: 'center' }} opacity={0.5} color="var(--color)" />
                            </Button>
                        }
                        >
                            <YStack padding={'$6'} gap='$6'>
                                <Text w={'$16'}>{'Please enter a unique key\n\n for the new DB item.'}</Text >
                                <Input
                                    placeholder='Enter new item key'
                                    onChangeText={text => { setNewKey(text); setError(false) }}
                                    value={newKey}
                                    color={error ? '$red10' : ''}
                                    onSubmitEditing={onCreateItem}
                                ></Input>
                                <Button hoverStyle={{ bc: 'var(--blue8)' }} disabled={error} onClick={onCreateItem} backgroundColor={error ? '$red10' : 'var(--blue9)'} >
                                    <Text color={"white"}>{error ? "Item already exists" : "Create"}</Text>
                                </Button>
                            </YStack>
                        </Popover>
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
                                isTemplate={element.key == tmpItem['key'] ? true : false}
                            />
                        </Stack>
                    )
                })}
            </XStack>
        </YStack>

    )
}