import { DatabaseEntryModel, DatabaseModel } from '.'
import { DataView, API, AdminPage, PaginatedDataSSR  } from 'protolib'
import { useRouter } from "next/router"
import { YStack } from '@my/ui'
import { DataCard } from '../../components/DataCard'
import { useState } from 'react'
import { Server } from '@tamagui/lucide-icons'
import { usePrompt } from '../../context/PromptAtom'


const DatabaseIcons = {}
const databasesSourceUrl = '/adminapi/v1/databases'

export default {
    'databases': {
        component: ({ workspace, pageState, initialItems, pageSession }: any) => {
            const router = useRouter()

            usePrompt(() => `At this moment the user is browsing the databases list page. The databases list page allows to list the system databases. Databases are based on leveldb, and stored under /data/databases.
            The user can use the database management page to view system databases, or can select a specific database from the list, and view the entries for the selected database.
            The system databases store the information in key->value system, storing JSONs as the value. 
            The databases are used to store users, groups, and as a storage for any CRUD API created for a object.
            To backup databases, just backup /data/databases folder. To reset a database, simply delete /data/databases/*databasename*.
            Using a special file called initialData.json at the same directory of your API, automatic crud apis will load initialData.json contents into the database when creating the database the first time. 
            Be careful editing the databases manually, the application may break. 
            `+ (
                initialItems.isLoaded?'Currently the system returned the following information: '+JSON.stringify(initialItems.data) : ''
            )) 
            return (<AdminPage title="Databases" workspace={workspace} pageSession={pageSession}>
                <DataView
                    integratedChat
                    rowIcon={Server}
                    sourceUrl={databasesSourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="database"
                    onSelectItem={(item) => {
                        //console.log("ITEMMM", item, item.getId())
                        router.push('/databases/view?database=' + item.getId())
                    }}
                    // hideAdd={true}
                    model={DatabaseModel}
                    pageState={pageState}
                    icons={DatabaseIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedDataSSR(databasesSourceUrl)
    },
    'databases/view': {
        component: ({ workspace, pageState, sourceUrl, initialItems, pageSession, extraData }: any) => {
            const router = useRouter()
            const [tmpItem, setTmpItem] = useState<string | null>(null)
            const [content, setContent] = useState(initialItems)
            const [newKey, setNewKey] = useState('')
            const [renew, setRenew] = useState(1)
            const [error, setError] = useState(false)
            const emptyItemValue = { exapmle: "exampleValue" }
            const [isPopoverOpen, setIsPopoverOpen] = useState(false)
            const currentDB = router.query.database ?? ''
            const fetch = async () => {
                setContent(await API.fetch('/adminapi/v1/databases/' + currentDB))
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
            return (<AdminPage title={currentDB} workspace={workspace} pageSession={pageSession}>
                <DataView
                    integratedChat
                    key={renew}
                    sourceUrl={'/adminapi/v1/databases/' + currentDB}
                    initialItems={content}
                    numColumnsForm={1}
                    name={currentDB}
                    pluralName={currentDB}
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
        getServerSideProps: PaginatedDataSSR((context) => '/adminapi/v1/databases/' + context.query.database, ['admin'])
    }
}
