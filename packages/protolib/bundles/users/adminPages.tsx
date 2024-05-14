import { UserModel } from '.'
import { z } from 'protolib/base'
import { DataTable2, Chip, DataView, usePrompt, AdminPage, useWorkspaceEnv } from 'protolib'
import moment from 'moment'
import { Mail, Tag, Key, User } from '@tamagui/lucide-icons';
import { API } from '../../base/Api'
import { SelectList } from '../../components/SelectList'
import { useState } from 'react';
import { getPendingResult } from '../../base';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { Switch, XStack, Text } from 'tamagui';
import { Tinted } from '../../components/Tinted';
import { PaginatedData } from '../../lib/SSR';

const format = 'YYYY-MM-DD HH:mm:ss'
const UserIcons = { username: Mail, type: Tag, passwod: Key, repassword: Key }

const sourceUrl = '/adminapi/v1/accounts'
const groupsSourceUrl = '/adminapi/v1/groups'

export default {
    'users': {
        component: ({ pageState, initialItems, itemData, pageSession, extraData }: any) => {
            const [all, setAll] = useState(false)
            const [groups, setGroups] = useState(extraData?.groups ?? getPendingResult("pending"))
            const env = useWorkspaceEnv()

            usePendingEffect((s) => { API.get(groupsSourceUrl, s) }, setGroups, extraData?.groups)

            const getValue = (data) => {
                const item = groups.data.items.map(obj => obj.name).find(item => item == data)
                if (!item) {
                    return ''
                }
                return item
            }

            usePrompt(() => `At this moment the user is browsing the user management page. The user management page allows to list, create, read, update and delete users and allows to reset the user passwords, chahing the user privileges (admin true/false) and chaing the user types.
            The zod schema for the user object is:
            export const UserSchema = Schema.object({
                username: z.string().email().label('email').hint('user@example.com').static().id().search(),
                type: z.string().min(1).hint('user, admin, ...').search().help("The type refers to a group name. Groups contains privileges (admin true/false) and workspaces."),
                password: z.string().min(6).hint('**********').secret().onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').help("Salted hashed password using bcrypt."),
                createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search(),
                lastLogin: z.string().optional().search(),
                from: z.string().min(1).search().generate((obj) => 'admin').help("Interface used to create the user. Users can be created from command line or from the admin panel")
            })
            the user management system is located at /packages/protolib/bundles/users. The api for managing users is for admins only, and its located at /adminapi/v1/accounts. To read a specify account, /adminapi/v1/accounts/:email.
            The UI of the users page is located at /packages/protolib/bundles/users/adminPages.tsx and the schema and protomodel declaration at /packages/protolib/bundles/users/usersSchema.ts. The API file is located at /packages/protolib/bundles/users/usersAPI.ts.
            The user management page allows to manage the users of the system. Users are able to login with their email and password.
            `+ (
                    initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
                ))

            return (<AdminPage title="Users" pageSession={pageSession}>
                <DataView
                    key={all ? 'all' : 'filtered'}
                    toolBarContent={
                        <XStack mr={"$2"} f={1} space="$1.5" ai="center" jc='flex-end'>
                            <Text fontSize={14} color="$color11">
                                View all
                            </Text>
                            <Tinted>
                                <Switch
                                    forceStyle='hover'
                                    checked={all}
                                    onCheckedChange={v => setAll(v)} size="$1"
                                >
                                    <Switch.Thumb animation="quick" backgroundColor={"$color9"} />
                                </Switch>
                            </Tinted>


                        </XStack>
                    }
                    integratedChat
                    enableAddToInitialData
                    entityName={'accounts'}
                    itemData={itemData}
                    rowIcon={User}
                    sourceUrl={sourceUrl}
                    sourceUrlParams={all ? undefined : { env }}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="user"
                    defaultView={'list'}
                    onAdd={data => {
                        if (data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const { repassword, ...finalData } = data
                        return { ...finalData, environments: [env] }
                    }}
                    onEdit={data => {
                        if (data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const { repassword, ...finalData } = data
                    }}
                    customFields={{
                        type: {
                            component: (path, data, setData, mode) => mode == 'add' || mode == 'edit' ? <SelectList
                                f={1}
                                title={'type'}
                                elements={groups?.data?.items.map(obj => obj.name).map(item => item)}
                                value={getValue(data)}
                                setValue={(v) => setData(v)}
                            /> : false
                        }
                    }}
                    columns={DataTable2.columns(
                        DataTable2.column("email", row => row.username, "username"),
                        DataTable2.column("type", row => row.type, "tyoe", row => <Chip text={row.type?.toUpperCase()} color={row.type == 'admin' ? '$color5' : '$gray5'} />),
                        DataTable2.column("from", row => row.from, "from", row => <Chip text={row.from?.toUpperCase()} color={row.from == 'cmd' ? '$blue5' : '$gray5'} />),
                        DataTable2.column("created", row => row.createdAt, "createdAt", row => moment(row.createdAt).format(format)),
                        DataTable2.column("last login", row => row.lastLogin, "lastLogin", row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'never'} color={'$gray5'} />),
                        DataTable2.column("environments", row => row.environments, "environments", row => row.environments ? <XStack>{row.environments.map((env) => <Chip text={env.toUpperCase()} color={env == '*' ? '$orange5' : (env == 'dev' ? '$gray5' : '$color5')} />)}</XStack> : <Chip text={'*'} color={'$orange5'} />)
                    )}
                    extraFieldsForms={{
                        repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret()
                    }}
                    model={UserModel}
                    pageState={pageState}
                    icons={UserIcons}
                    dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedData(sourceUrl, ['admin'], {groups: groupsSourceUrl})
    }
}