
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { {{object}}Model } from '.'
import {DataView} from 'protolib'
import { DataTable2, Chip, API } from 'protolib'
import {z} from 'zod'

const Icons =  {}
const isProtected = Protofy("protected", {{protected}})

export default {
    route: Protofy("route", "{{route}}"),
    component: ({workspace, pageState, sourceUrl, initialItems, pageSession, extraData}:any) => {
        return (<AdminPage title="{{object}}" workspace={workspace} pageSession={pageSession}>
            <DataView
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="{{object}}"
                model={ {{object}}Model} 
                pageState={pageState}
                icons={Icons}
            />
        </AdminPage>)
    }, 
    getServerSideProps: PaginatedDataSSR('{{apiUrl}}', isProtected?Protofy("permissions", {{permissions}}):undefined)
}