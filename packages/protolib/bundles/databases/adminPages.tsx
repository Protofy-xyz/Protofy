import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { DatabaseEntryModel, DatabaseModel } from '.'
import { DataView, DataTable2, Chip, API, withSession, getPendingResult } from 'protolib'
import { useRouter } from "next/router"
import { SSR } from 'app/conf'
import DBAdmin from './components/db'
import { Paragraph, XStack, YStack } from '@my/ui'
import { Tinted } from '../../components/Tinted'
import { DataCard } from '../../components/DataCard'
import { useState } from 'react'
import { Server } from '@tamagui/lucide-icons'
const format = 'YYYY-MM-DD HH:mm:ss'
const DatabaseIcons = {}
const rowsPerPage = 20

export default {
    'admin/databases': {
        component: ({ workspace, pageState, sourceUrl, initialItems, pageSession }: any) => {
            const router = useRouter()
            return (<AdminPage title="Databases" workspace={workspace} pageSession={pageSession}>
                <DataView
                    integratedChat
                    rowIcon={Server}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="database"
                    onSelectItem={(item) => {
                        //console.log("ITEMMM", item, item.getId())
                        router.push('/admin/databases/' + item.getId())
                    }}
                    // hideAdd={true}
                    model={DatabaseModel}
                    pageState={pageState}
                    icons={DatabaseIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/databases')
    },
    'admin/databases/*': {
        component: ({ workspace, pageState, sourceUrl, initialItems, pageSession, extraData }: any) => {
            const router = useRouter()
            const [tmpItem, setTmpItem] = useState<string | null>(null)
            const [content, setContent] = useState(initialItems)
            const [newKey, setNewKey] = useState('')
            const [renew, setRenew] = useState(1)
            const [error, setError] = useState(false)
            const emptyItemValue = { exapmle: "exampleValue" }
            const [isPopoverOpen, setIsPopoverOpen] = useState(false)
            const currentDB = extraData.name
            const fetch = async () => {
                setContent(await API.fetch(sourceUrl))
            }
            const onDelete = async (key, isTemplate) => {
                if (isTemplate) {
                    setTmpItem(null)
                    content.data.shift()
                } else {
                    const result = await API.get('/adminapi/v1/databases/' + currentDB + '/' + key + '/delete')
                    if (result?.isLoaded && result.data.result == 'deleted') {
                        await fetch()
                        setRenew(renew + 1)
                    }
                }
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
                const result = await API.post('/adminapi/v1/databases/' + currentDB + '/' + key, newContent)
                if (result?.isLoaded) {
                    await fetch()
                    setRenew(renew + 1)
                }
                setTmpItem(null)
                return result
            }
            return (<AdminPage title={extraData.name} workspace={workspace} pageSession={pageSession}>
                <DataView
                    integratedChat
                    key={renew}
                    sourceUrl={sourceUrl}
                    initialItems={content}
                    numColumnsForm={1}
                    name={extraData.name}
                    pluralName={extraData.name}
                    // hideAdd={true}
                    model={DatabaseEntryModel}
                    pageState={pageState}
                    icons={DatabaseIcons}
                    disableViewSelector
                    defaultView="grid"
                    dataTableGridProps={{
                        itemMinWidth: 500,
                        overScanBy: 1,
                        getCard: (data, width) => {
                            const { _key, ...element } = data
                            return <YStack px={"$3"} pb="$4" f={1}>
                                <DataCard
                                    innerContainerProps={{
                                        maxWidth: 700,
                                        $md: { maxWidth: 450 },
                                        $sm: { minWidth: 'calc(100vw - 65px)', maxWidth: 'calc(100vw - 65px)' },
                                        minWidth: 300,
                                        p:'$3'
                                    }}
                                    onDelete={onDelete}
                                    key={renew}
                                    onSave={(content) => onSave(content, _key)}
                                    json={element}
                                    name={_key}
                                    isTemplate={_key == tmpItem}
                                />
                            </YStack>
                        }
                    }}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedDataSSR((context) => '/adminapi/v1/databases/' + context.query.name[2], ['admin'], {
            itemsPerPage: 1000000
        }, (context) => {
            return { name: context.query.name[2] }
        })
    }
}
