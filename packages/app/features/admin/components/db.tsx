import { YStack, XStack, Stack, Paragraph, Text } from 'tamagui'
import {useAtom, API, createApiAtom, DataCard, Search } from 'protolib'
import { atom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTint } from '@tamagui/logo'

const contentAtom = createApiAtom([])

export default function DBAdmin({contentState}) {
    const router = useRouter()

    const [content, setContent] = useAtom(contentAtom, contentState)
    const currentDB = router.query.name
    const [renew, setRenew] = useState(1)
    const [originalContent, setOriginalContent] = useState<any>()
    const { tint } = useTint()

    // usePendingEffect(async () => {
    //     const databases = await API.get('/adminapi/v1/databases')
    //     setDatabases(databases)
    //     if (databases?.isLoaded && databases?.data.length) {
    //         API.get('/adminapi/v1/databases/' + currentDB, setContent)
    //     }
    // }, databases)
    console.log('currentDB', currentDB)
    useUpdateEffect(() => {
        console.log('refreshing database content')
        API.get('/adminapi/v1/databases/' + currentDB, setContent)
    }, [currentDB])

    const onDelete = async (key) => {
        const result = await API.get('/adminapi/v1/databases/' + currentDB + '/' + key + '/delete')
        if (result?.isLoaded && result.data.result == 'deleted') {
            setContent({ ...content, data: content.data.filter((l) => l.key != key) })
        }
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
        return result
    }

    const onSearch = async (text) => {
        if(!originalContent) setOriginalContent(content)
        API.post('/adminapi/v1/dbsearch/' + currentDB, {search: text}, setContent)
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
                </XStack>
            </XStack>
            <XStack flexWrap='wrap'>
                {content?.data?.map((element, i) => {
                    return (
                        <Stack key={i} p={"$5"}>
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
                            />
                        </Stack>
                    )
                })}
            </XStack>
        </YStack>

    )
}