import { YStack, XStack, Stack, Paragraph, Text } from 'tamagui'
import { API, createApiAtom, usePendingEffect, PanelMenuItem, useHydratedAtom, DataCard, Search } from 'protolib'
import { PanelLayout } from '../../layout/PanelLayout'
import { Database } from '@tamagui/lucide-icons'
import { atom, useAtom } from 'jotai'
import { useUpdateEffect } from 'usehooks-ts'
import { useRouter } from 'next/router'
import { Link } from '@my/ui'
import { useState } from 'react'
import { useTint } from '@tamagui/logo'

const [dbsArr, dbsAtom] = createApiAtom([])
const [contentArr, contentAtom] = createApiAtom([])
const currentDbAtom = atom(0)

const Menu = () => {
    const [currentDB, setCurrentDB] = useAtom(currentDbAtom);
    const [databases] = useAtom(dbsAtom)
    return (<YStack pt="$10">
        {databases.data?.map((db, i) => (
            <Link
                href={"/admin/db/" + db.name}
                onPressApp={() => setCurrentDB(db.name)} key={i}
            >
                <PanelMenuItem
                    selected={db.name == currentDB}
                    icon={<Database color="$color11" strokeWidth={1.5} />}
                    text={db.name}
                />
            </Link>
        ))}
    </YStack>)
}

export default function Admin({ pageSession, databasesState, currentDbState, contentState }) {
    const router = useRouter()
    const [databases, setDatabases] = useHydratedAtom(dbsArr, databasesState, dbsAtom)
    const [content, setContent] = useHydratedAtom(contentArr, contentState, contentAtom)
    const [currentDB] = useHydratedAtom(currentDbAtom, currentDbState ?? router.query.name)
    const [renew, setRenew] = useState(1)
    const [originalContent, setOriginalContent] = useState<any>()
    const { tint } = useTint()

    usePendingEffect(async () => {
        const databases = await API.get('/adminapi/v1/databases')
        setDatabases(databases)
        if (databases?.isLoaded && databases?.data.length) {
            API.get('/adminapi/v1/databases/' + currentDB, setContent)
        }
    }, databases)

    useUpdateEffect(() => {
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

    return (<PanelLayout menuContent={<Menu />}>
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
        <XStack f={1} flexWrap='wrap'>
            {content?.data?.map((element, i) => {
                return (
                    <Stack key={i} p={"$5"}>
                        <DataCard
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
    </PanelLayout>)
}