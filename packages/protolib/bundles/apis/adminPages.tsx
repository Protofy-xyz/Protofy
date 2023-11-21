
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { APIModel } from '.'
import {DataView} from 'protolib'
import { DataTable2, Chip, API } from 'protolib'
import { ToyBrick, Pencil } from '@tamagui/lucide-icons'

import {z} from 'zod'
import { usePageParams } from '../../next'
import { getURLWithToken } from '../../lib/Session'
import { usePrompt } from '../../context/PromptAtom'

const APIIcons =  {}

export default {
    'admin/apis': {
        component: ({pageState, sourceUrl, initialItems, pageSession, extraData}:any) => {
            const {replace} = usePageParams(pageState)
            console.log('initialItems: ', initialItems)
            usePrompt(() => `At this moment the user is browsing the Rest API management page. The Rest API management page allows to list, create, read, update and delete API definitions. API definitions are typescript files using express.
            The system allows to create APIs either from an empty template, or from an AutoCRUD template. The automatic crud template creates an automatic CRUD API for a given object. 
            To Automatic CRUD API generates the following endpoints: get /api/v1/:objectName (list), post /api/v1/:objectName (create), post /api/v1/:objectName/:objectId (update), get /api/v1/:objectName/:objectId/delete (delete) and get /api/v1/:objectName/:objectId (read)
            the API files are located at /packages/app/bundles/custom/apis. 
            The Automatic CURD system can be manually extended to have more endpoints.
            The user can edit the API files by clicking on any API, and can choose visual programming using interactive diagrams generated from the source code, or text based tradicional programming to edit the .ts api file.
            Those APIs allow the user to create pages based on object data. The automatic crud is an "storage" to manage data for a specific object.
            ` + (
             initialItems.isLoaded?'Currently the system returned the following information: '+JSON.stringify(initialItems.data) : ''
            ))

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