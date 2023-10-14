
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { GroupModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key, User, Group } from '@tamagui/lucide-icons';

const format = 'YYYY-MM-DD HH:mm:ss'
const UserIcons =  {}

export default {
    'admin/groups': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Groups" workspace={workspace} pageSession={pageSession}>
                <DataView
                    rowIcon={Group}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="group"
                    onAdd={data => {
                        return data
                    }}
                    onEdit={data => {
                        return data;
                    }}

                    columns={DataTable2.columns(
                        DataTable2.column("email", "username", true),
                        DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5':'$gray5'} />),
                        DataTable2.column("from", "from", true, row => <Chip text={row.from.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$gray5'} />),
                        DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                        DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                    )}
                    extraFields={{ 
                        repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret()
                    }}
                    defaultCreateData={{from:'admin'}} 
                    model={UserModel} 
                    pageState={pageState}
                    icons={UserIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/accounts')
    }
}