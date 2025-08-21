
import { ObjectModel } from './objectsSchemas'
import { DataView } from 'protolib/components/DataView';
import { DataTable2 } from 'protolib/components/DataTable2';
import { Chip } from 'protolib/components/Chip';
import { AdminPage } from 'protolib/components/AdminPage';
import { Pencil } from '@tamagui/lucide-icons';
import { usePageParams } from 'protolib/next';
import { XStack, Text } from "@my/ui";
import { z } from 'protobase'
import ErrorMessage from "protolib/components/ErrorMessage"
import { PaginatedData } from "protolib/lib/SSR"
import { ProtoModel } from 'protobase'
import { useRouter } from 'next/router'
import { AsyncView } from 'protolib/components/AsyncView';
import { ObjectViewLoader } from 'protolib/components/ObjectViewLoader';

const format = 'YYYY-MM-DD HH:mm:ss'
const ObjectIcons = {}
const rowsPerPage = 20

const sourceUrl = '/api/core/v1/objects'

export const hasHTMLCompiler = process.env.NODE_ENV !== "production";

const ObjectView = ({ workspace, pageState, initialItems, itemData, pageSession, extraData, object }: any) => {
    const objExists = object ? true : false
    let objModel = null
    let apiUrl = null
    if (objExists) {
        objModel = ProtoModel.getClassFromDefinition(object)
        const { name, prefix } = objModel.getApiOptions()
        console.log("Object API options", { name, prefix })
        apiUrl = prefix + name
    }

    const fields = objModel?.getObjectFields()
    let reducedView = false
    if(!fields || fields.length === 0 || (fields.length === 1 && fields[0] == "id")) {
        reducedView = true
    }
    // const {name, prefix} = Objects.inventory.getApiOptions()
    // const apiUrl = prefix + name
    return (<AdminPage title={"Object " + object?.name} workspace={workspace} pageSession={pageSession}>
        {!objExists ? <ErrorMessage msg="Object not found" /> : null}
        {objExists ? <DataView
            disableViews={reducedView ? ["grid", "list"]:[]}
            sourceUrl={apiUrl}
            initialItems={initialItems}
            numColumnsForm={1}
            name={object?.name}
            model={objModel}
            pageState={pageState}
            hideFilters={false}
        /> : null}
    </AdminPage>)
}

export default {
    'objects': {
        component: ({ pageState, initialItems, pageSession }: any) => {
            const { replace } = usePageParams(pageState)
            return (<AdminPage title="Objects" pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="storage"
                    entityName='Storages'
                    columns={DataTable2.columns(
                        DataTable2.column("name", row => row.name, "name", row => <XStack id={"objects-datatable-" + row.name}><Text>{row.name}</Text></XStack>),
                        DataTable2.column("features", row => row.features, "features", row => Object.keys(row.features).map(f => <Chip mr={"$2"} text={f} color={'$gray5'} />)),
                    )}
                    extraFieldsFormsAdd={{
                        databaseType: z.union([z.literal("Default Provider"), z.literal("Google Sheets"), z.literal("JSON File")])
                            .after("keys")
                            .label("database type")
                            .defaultValue("Default Provider"),
                        param: z.string()
                            .after("keys")
                            .label("Google Sheet Link")
                            .hint("https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit?usp=sharing")
                            .visible((displayType, object) => object?.data?.databaseType === "Google Sheets"),
                        adminPage: z.boolean()
                            .after("keys")
                            .label("customizable admin page")
                            .defaultValue(false)
                            .visible((displayType, object) => hasHTMLCompiler),
                    }}
                    // hideAdd={true}
                    model={ObjectModel}
                    pageState={pageState}
                    icons={ObjectIcons}

                    extraMenuActions={[
                        {
                            text: "Edit Object file",
                            icon: Pencil,
                            action: (element) => { replace('editFile', element.getDefaultSchemaFilePath()) },
                            isVisible: (data) => true
                        }
                    ]}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedData(sourceUrl, ['admin'])
    },
    view: {
        component: (props: any) => {
            const router = useRouter()
            const { object } = router.query
            if (!object) return <></>
            return <AsyncView ready={router.isReady}>
                <ObjectViewLoader key={object} {...props} object={object} widget={ObjectView}/>
            </AsyncView>
        }
    }
}