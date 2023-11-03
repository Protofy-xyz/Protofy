
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { PageModel } from '.'
import {DataView} from 'protolib'
import { DataTable2, Chip, API } from 'protolib'
import {z} from 'zod'

const PageIcons =  {}

export default {
    'admin/pages': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession, extraData}:any) => {
            console.log('extra data: ', extraData)
            return (<AdminPage title="Pages" workspace={workspace} pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="page"
                    columns={DataTable2.columns(
                        DataTable2.column("name", "name", true),
                        DataTable2.column("route", "route", true),
                        DataTable2.column("visibility", "protected", true, row => !row.protected ? <Chip text={'public'} color={'$color5'} />: <Chip text={'protected'} color={'$gray5'} />),
                        DataTable2.column("permissions", "permissions", true, row => row.permissions.map(p => <Chip text={p} color={'$gray5'} /> ) ),

                        // DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5':'$gray5'} />),
                        // DataTable2.column("from", "from", true, row => <Chip text={row.from?.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$gray5'} />),
                        // DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                        // DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                    )}
                    extraFieldsFormsAdd={{
                        template: z.union([z.literal("blank"), z.literal("default"), z.literal("admin")]).display().generate(() => 'default').after("route"),
                        object: z.union([z.literal("without object"), ...extraData.objects.map(o => z.literal(o.name))] as any).after('route').display(),
                    }}
                    model={PageModel} 
                    pageState={pageState}
                    icons={PageIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/pages', ['admin'], {}, async () => {
            const objects = await API.get('/adminapi/v1/objects?itemsPerPage=1000')
            return {
                objects: objects.isLoaded ? objects.data.items : []
            }
        })
    }
}