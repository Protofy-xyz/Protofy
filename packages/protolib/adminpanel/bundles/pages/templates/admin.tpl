import {Protofy} from 'protolib/base'
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import {Objects} from 'app/bundles/objects'
import {DataView} from 'protolib'

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
                model={Objects.{{_object}} } 
                pageState={pageState}
                icons={Icons}
            />
        </AdminPage>)
    }, 
    getServerSideProps: PaginatedDataSSR('{{apiUrl}}', isProtected?Protofy("permissions", {{permissions}}):undefined)
}