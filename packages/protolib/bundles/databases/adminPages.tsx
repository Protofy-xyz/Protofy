import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { DatabaseModel } from '.'
import { DataView, DataTable2, Chip, API, withSession } from 'protolib'
import { useRouter } from "next/router"
import { SSR } from 'app/conf'
import DBAdmin from '../../adminpanel/features/components/db'
const format = 'YYYY-MM-DD HH:mm:ss'
const DatabaseIcons = {}
const rowsPerPage = 20

export default {
    'admin/databases': {
        component: ({ workspace, pageState, sourceUrl, initialItems, pageSession }: any) => {
            const router = useRouter()
            return (<AdminPage title="Databases" workspace={workspace} pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="database"
                    onSelectItem={(item) => {
                        //console.log("ITEMMM", item, item.getId())
                        router.push('/admin/databases/' + item.getId())
                    }}
                    // hideAdd={true}
                    model={DatabaseModel}
                    pageState={pageState}
                    icons={DatabaseIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/databases')
    },
    'admin/databases/*': {
        component: ({ workspace, sourceUrl, initialItems, pageSession }: any) => {
            const router = useRouter()
            return (<AdminPage title="Databases" workspace={workspace} pageSession={pageSession}>
                       <DBAdmin contentState={initialItems} />
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, [], async () => {
            const initialItems = await API.get('/adminapi/v1/databases/'+context.query.name[2])
            return {
                workspace: await API.get('/adminapi/v1/workspaces'),
                initialItems: initialItems,
                sourceUrl: '/adminapi/v1/databases/'+context.query.name[2]
            }
        }))
    } 
}
