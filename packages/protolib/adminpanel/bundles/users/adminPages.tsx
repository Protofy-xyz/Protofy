
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { UserModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key, User } from '@tamagui/lucide-icons';

const format = 'YYYY-MM-DD HH:mm:ss'
const UserIcons =  {username: Mail, type: Tag, passwod: Key, repassword: Key}

export default {
    'admin/users': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Users" workspace={workspace} pageSession={pageSession}>
                <DataView
                    rowIcon={User}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="user"
                    onAdd={data => {
                        if(data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const {repassword, ...finalData} = data
                        return finalData
                    }}
                    onEdit={data => {
                        if(data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const {repassword, ...finalData} = data
                        return finalData
                    }}

                    columns={DataTable2.columns(
                        DataTable2.column("email", "username", true),
                        DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5':'$gray5'} />),
                        DataTable2.column("from", "from", true, row => <Chip text={row.from.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$gray5'} />),
                        DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                        DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                    )}
                    extraFields={{ 
                        repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret().display()
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