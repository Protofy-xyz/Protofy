
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { UserModel } from '.'
import { z } from 'protolib/base'
import { DataTable2, Chip, DataView, usePrompt } from 'protolib'
import moment from 'moment'
import { Mail, Tag, Key, User } from '@tamagui/lucide-icons';
import { API } from '../../base/Api'
import { SelectList } from '../../components/SelectList'

const format = 'YYYY-MM-DD HH:mm:ss'
const UserIcons = { username: Mail, type: Tag, passwod: Key, repassword: Key }

export default {
    'admin/users': {
        component: ({ pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
            const getValue = (data) => {
                const item = extraData.groups.find(item => item == data)
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
                initialItems.isLoaded?'Currently the system returned the following information: '+JSON.stringify(initialItems.data) : ''
            )) 

            return (<AdminPage title="Users" pageSession={pageSession}>
                <DataView
                    integratedChat
                    enableAddToInitialData
                    entityName={'accounts'}
                    itemData={itemData}
                    rowIcon={User}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="user"
                    defaultView={'list'}
                    onAdd={data => {
                        if (data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const { repassword, ...finalData } = data
                        return finalData
                    }}
                    onEdit={data => {
                        if (data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const { repassword, ...finalData } = data
                        return finalData
                    }}
                    customFields={{
                        type: {
                            component: (path, data, setData, mode) => mode == 'add' || mode == 'edit' ? <SelectList
                                f={1}
                                title={'type'}
                                elements={extraData.groups?.map(item => item)}
                                value={getValue(data)}
                                setValue={(v) => setData(v)}
                            /> : false
                        }
                    }}

                    columns={DataTable2.columns(
                        DataTable2.column("email", "username", true),
                        DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5' : '$gray5'} />),
                        DataTable2.column("from", "from", true, row => <Chip text={row.from?.toUpperCase()} color={row.from == 'cmd' ? '$blue5' : '$gray5'} />),
                        DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                        DataTable2.column("last login", "lastLogin", true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'never'} color={'$gray5'} />)
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
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/accounts', ['admin'], {}, async () => {
            const groups = await API.get('/adminapi/v1/groups')
            const groupsArray = groups.data.items.map(obj => obj.name);
            return {
                groups: groupsArray,
            }
        })
    }
}