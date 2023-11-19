
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { APIModel } from '.'
import {DataView} from 'protolib'
import { DataTable2, Chip, API } from 'protolib'
import {z} from 'zod'

const APIIcons =  {}

export default {
    'admin/apis': {
        component: ({pageState, sourceUrl, initialItems, pageSession, extraData}:any) => {

            return (<AdminPage title="APIs" pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="api"
                    // columns={DataTable2.columns(
                    //     DataTable2.column("name", "name", true),
                    //     DataTable2.column("route", "route", true),
                    //     DataTable2.column("visibility", "protected", true, row => !row.protected ? <Chip text={'public'} color={'$color5'} />: <Chip text={'protected'} color={'$gray5'} />),
                    //     DataTable2.column("permissions", "permissions", true, row => row.permissions.map(p => <Chip text={p} color={'$gray5'} /> ) ),
                    // )}
                    // extraFieldsFormsAdd={{
                    //     template: z.union([z.literal("blank"), z.literal("default"), z.literal("admin")]).display().after("route"),
                    //     object: z.union([z.literal("without object"), ...extraData.objects.map(o => z.literal(o.name))] as any).after('route').display(),
                    // }}
                    model={APIModel} 
                    pageState={pageState}
                    icons={APIIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/apis', ['admin'], {}, async () => {
            const objects = await API.get('/adminapi/v1/objects?itemsPerPage=1000')
            return {
                objects: objects.isLoaded ? objects.data.items : []
            }
        })
    }
}