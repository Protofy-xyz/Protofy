
import {AdminPage, SSR} from 'protolib/adminpanel/features/next'
import { UserModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key } from '@tamagui/lucide-icons';

const format = 'YYYY-MM-DD HH:mm:ss'
const UserIcons =  {username: Mail, type: Tag, passwod: Key, repassword: Key}
const rowsPerPage = 20
export default {
    'admin/users': {
        component: ({workspace, initialItems, pageSession}:any) => {
            return (<AdminPage workspace={workspace} pageSession={pageSession}>
                <DataView
                    onAdd={data => {
                        if(data.password != data.repassword) {
                            throw "Passwords do not match"
                        }
                        const {repassword, ...finalData} = data
                        return finalData
                    }}
                    columns={DataTable2.columns(
                        DataTable2.column("email", "username", true),
                        DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$blue5':'$color5'} />),
                        DataTable2.column("from", "from", true, row => <Chip text={row.from.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$color5'} />),
                        DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                        DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$color5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                    )}
                    extraFields={{ 
                        repassword: z.string().min(6).label('repeat password').after('password').hint('**********').secret()
                    }}
                    defaultCreateData={{from:'admin'}} 
                    model={UserModel} 
                    sourceUrl="/adminapi/v1/accounts" 
                    initialItems={initialItems} 
                    icons={UserIcons}
                    rowsPerPage={rowsPerPage} 
                />
            </AdminPage>)
        }, 
        getServerSideProps: SSR('/adminapi/v1/accounts?itemsPerPage='+rowsPerPage)
    }
}