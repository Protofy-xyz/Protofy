
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { ObjectModel } from '.'
import {DataView, DataTable2, Chip, API, usePrompt} from 'protolib'
import { Pencil, Box } from '@tamagui/lucide-icons';
import { usePageParams } from '../../next';

const format = 'YYYY-MM-DD HH:mm:ss'
const ObjectIcons =  {}
const rowsPerPage = 20
export default {
    'admin/objects': {
        component: ({pageState, sourceUrl, initialItems, pageSession}:any) => {
            const {replace} = usePageParams(pageState)

            usePrompt(() => `At this moment the user is browsing the user management page. The user management page allows to list, create, read, update and delete users and allows to reset the user passwords, chahing the user privileges (admin true/false) and chaing the user types.
The zod schema for the user object is:
export const UserSchema = Schema.object({
    username: z.string().email().label('email').hint('user@example.com').static().id().search().display(),
    type: z.string().min(1).hint('user, admin, ...').search().display(),
    password: z.string().min(6).hint('**********').secret().onCreate('cypher').onUpdate('update').onRead('clearPassword').onList('clearPassword').display(),
    createdAt: z.string().min(1).generate((obj) => moment().toISOString()).search(),
    lastLogin: z.string().optional().search(),
    from: z.string().min(1).search().generate((obj) => 'admin').help("
})
the user management system is located at /packages/protolib/bundles/users. The api for managing users is for admins only, and its located at /adminapi/v1/accounts. To read a specify account, /adminapi/v1/accounts/:email.
The UI of the users page is located at /packages/protolib/bundles/users/adminPages.tsx and the schema and protomodel declaration at /packages/protolib/bundles/users/usersSchema.ts. The API file is located at /packages/protolib/bundles/users/usersAPI.ts
`)

            return (<AdminPage title="Objects" pageSession={pageSession}>
                <DataView
                    integratedChat
                    rowIcon={Box}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="object"
                    columns={DataTable2.columns(
                        DataTable2.column("name", "name", true),
                        DataTable2.column("api", "api", true, row => !row.api ? <Chip text={'no'} color={'$gray5'} />: <Chip text={'yes'} color={'$color5'} />),
                    )}
                    // hideAdd={true}
                    model={ObjectModel} 
                    pageState={pageState}
                    icons={ObjectIcons}
                    extraMenuActions = {[
                        {
                            text:"Edit API file", 
                            icon:Pencil, 
                            action: (element) => { replace('editFile', element.getDefaultAPIFilePath()) }, 
                            isVisible: (element)=>element.data.api?true:false
                        },
                        {
                            text:"Edit Object file", 
                            icon:Pencil, 
                            action: (element) => { replace('editFile', element.getDefaultSchemaFilePath()) },
                            isVisible: (data)=>true}
                    ]}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/objects', ['admin'], {
            orderBy: 'name'
        })
    }
}