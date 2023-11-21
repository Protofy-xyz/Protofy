
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { APIModel } from '.'
import {DataView} from 'protolib'
import { DataTable2, Chip, API } from 'protolib'
import { ToyBrick, Pencil } from '@tamagui/lucide-icons'

import {z} from 'zod'
import { usePageParams } from '../../next'
import { getURLWithToken } from '../../lib/Session'

const APIIcons =  {}

export default {
    'admin/apis': {
        component: ({pageState, sourceUrl, initialItems, pageSession, extraData}:any) => {
            const {replace} = usePageParams(pageState)
            //replace('editFile', '/packages/app/bundles/custom/apis/')
            return (<AdminPage title="APIs" pageSession={pageSession}>
                <DataView
                    integratedChat
                    onSelectItem={(item) => replace('editFile', '/packages/app/bundles/custom/apis/'+item.data.name+'.ts')}
                    rowIcon={ToyBrick}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="api"
                    columns={DataTable2.columns(
                        DataTable2.column("name", "name", true),
                    )}
                    extraFieldsFormsAdd={{
                        template: z.union([z.literal("Automatic CRUD"), z.literal("empty")]).display().after("name"),
                        object: z.union([z.literal("without object"), ...extraData.objects.map(o => z.literal(o.name))] as any).after('name').display(),
                    }}
                    model={APIModel} 
                    pageState={pageState}
                    icons={APIIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/apis', ['admin'], {}, async (context) => {
            const objects = await API.get(getURLWithToken('/adminapi/v1/objects?all=1', context))
            return {
                objects: objects.isLoaded ? objects.data.items : []
            }
        })
    }
}