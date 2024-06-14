import { DatabaseEntryModel, DatabaseModel } from '.'
import { DataView, API, AdminPage, PaginatedDataSSR, AlertDialog, Tinted, Center, useWorkspaceEnv } from 'protolib'
import { useRouter } from "next/router"
import { Spinner, YStack } from '@my/ui'
import { DataCard } from '../../components/DataCard'
import { useState } from 'react'
import { Database, DatabaseBackup } from '@tamagui/lucide-icons'
import { usePrompt } from '../../context/PromptAtom'
import { SSR } from '../../lib/SSR'
import { withSession } from '../../lib/Session'

const DatabaseIcons = {}
const databasesSourceUrl = '/adminapi/v1/databases'

const generateBackup = async (element) => {
    let ids = []
    if (Array.isArray(element)) {
        ids = element.map(el => el.name);
    } else if (typeof element === 'string' && element === "*") {
        ids = ["*"];
    } else if (typeof element === 'object' && element !== null && element.data) {
        ids = [element.data.name];
    } else {
        throw new Error("Invalid input for extractIds");
    }
    await API.post('/adminapi/v1/backup/databases', ids)
}

export default {
    'databases': {
        component: ({ workspace, pageState, initialItems, pageSession, env}: any) => {
            const workspaceEnv = useWorkspaceEnv()
            const router = useRouter()
            const subpath = env == 'system' ? './system/' : './databases/'
            env = env == 'system' ? undefined : workspaceEnv
            const entityName = !env ? 'System' : 'Application'

            const [open, setOpen] = useState(false)
            const [backupId, setBackupId] = useState("")
            const [currentType, setCurrentType] = useState("")
            const [numSelectedItems, setNumSelectedItems] = useState(0)

            const dialogMessages = {
                "item": {
                    buttonCaption: "Backup",
                    title: "Create Backup",
                    description: "Are you sure want to backup this database?"
                },
                "bulk": {
                    buttonCaption: "Backup",
                    title: "Create Backups",
                    description: "Are you sure want to backup "+ numSelectedItems +" databases?"
                },
                "global": {
                    buttonCaption: "Backup all databases",
                    title: "Create Backups",
                    description: "Are you sure want to backup all databases?"
                }
            }

            usePrompt(() => `At this moment the user is browsing the databases list page. The databases list page allows to list the system databases. Databases are based on leveldb, and stored under /data/databases.
            The user can use the database management page to view system databases, or can select a specific database from the list, and view the entries for the selected database.
            The system databases store the information in key->value system, storing JSONs as the value. 
            The databases are used to store users, groups, and as a storage for any CRUD API created for a object.
            To backup databases, just backup /data/databases folder. To reset a database, simply delete /data/databases/*databasename*.
            Using a special file called initialData.json at the same directory of your API, automatic crud apis will load initialData.json contents into the database when creating the database the first time. 
            Be careful editing the databases manually, the application may break. 
            `+ (
                    initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
                ))
            return (<AdminPage title="Databases" workspace={workspace} pageSession={pageSession}>
                <AlertDialog
                    acceptCaption="Create Backup"
                    setOpen={setOpen}
                    open={open}
                    onAccept={async (setOpen) => {
                        await generateBackup(backupId)
                        setOpen(false);
                    }}
                    title={dialogMessages[currentType]?.title}
                    description={dialogMessages[currentType]?.description}
                    w={400}
                >
                    <YStack f={1} jc="center" ai="center">

                    </YStack>
                </AlertDialog>
                <DataView
                    rowIcon={entityName == 'Application' ? DatabaseBackup : Database}
                    sourceUrl={databasesSourceUrl+(env?'?env='+env: '')}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    entityName={entityName + ' databases'+(entityName != 'System' && env == 'dev' ? ' (dev)' : '')}
                    name="database"
                    onSelectItem={(item) => {
                        router.push(subpath+'view?database=' + item.getId()+(env?'&env='+env: ''))
                    }}
                    // hideAdd={true}
                    model={DatabaseModel}
                    pageState={pageState}
                    icons={DatabaseIcons}
                    extraMenuActions={[
                        {
                            text: (type) => dialogMessages[type].buttonCaption,
                            icon: DatabaseBackup,
                            action: (element) => {
                                let type = "item"
                                if (element == "*") {
                                    type = "global"
                                } else if (Array.isArray(element)) {
                                    type = "bulk"
                                    setNumSelectedItems(element.length)
                                }
                                setCurrentType(type)
                                setBackupId(element)
                                setOpen(true)
                            },
                            isVisible: (data) => true,
                            menus: ["item", "global", "bulk"]
                        }
                    ]}
                />
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
    },
    'databases/view': {
        component: ({ workspace, pageState, sourceUrl, initialItems, pageSession, extraData, env }: any) => {
            const router = useRouter()
            const [tmpItem, setTmpItem] = useState<string | null>(null)
            const [content, setContent] = useState(initialItems)
            const [newKey, setNewKey] = useState('')
            const [renew, setRenew] = useState(1)
            const [error, setError] = useState(false)
            const emptyItemValue = { exapmle: "exampleValue" }
            const [isPopoverOpen, setIsPopoverOpen] = useState(false)
            const currentDB = router.query.database ?? ''

            const workspaceEnv = useWorkspaceEnv()
            env = env == 'system' ? undefined : workspaceEnv

            const fetch = async () => {
                setContent(await API.fetch('/adminapi/v1/databases/' + currentDB+(env?'?env='+env: '')))
            }
            const onDelete = async (key, isTemplate) => {
                if (isTemplate) {
                    setTmpItem(null)
                    content.data.shift()
                } else {
                    const result = await API.get('/adminapi/v1/databases/' + currentDB + '/' + key + '/delete'+(env?'?env='+env: ''))
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
                const result = await API.post('/adminapi/v1/databases/' + currentDB + '/' + key+(env?'?env='+env: ''), newContent)
                if (result?.isLoaded) {
                    await fetch()
                    setRenew(renew + 1)
                }
                setTmpItem(null)
                return result
            }

            
            return (<AdminPage title={currentDB} workspace={workspace} pageSession={pageSession}>
                {router.isReady ? <DataView
                    integratedChat
                    key={renew}
                    sourceUrl={'/adminapi/v1/databases/' + currentDB+(env?'?env='+env: '') }
                    initialItems={content}
                    numColumnsForm={1}
                    name={currentDB}
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
                                        p: '$3'
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
                /> : <Tinted><Center><Spinner size='large' color="$color7" scale={2} /></Center></Tinted>}
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
    }
}
