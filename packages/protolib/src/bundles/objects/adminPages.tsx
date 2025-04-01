
import { ObjectModel } from './objectsSchemas'
import { DataView } from '../../components/DataView';
import { DataTable2 } from '../../components/DataTable2';
import { Chip } from '../../components/Chip';
import { AdminPage } from '../../components/AdminPage';
import { Pencil, Boxes, Tag } from '@tamagui/lucide-icons';
import { usePageParams } from '../../next';
import { XStack, Text } from "@my/ui";
import { z } from 'protobase'
import ErrorMessage from "../../components/ErrorMessage"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import { API, ProtoModel } from 'protobase'

const format = 'YYYY-MM-DD HH:mm:ss'
const ObjectIcons = {}
const rowsPerPage = 20

const sourceUrl = '/api/core/v1/objects'

export default {
    'objects': {
        component: ({ pageState, initialItems, pageSession }: any) => {
            const { replace } = usePageParams(pageState)
            return (<AdminPage title="Objects" pageSession={pageSession}>
                <DataView
                    rowIcon={Boxes}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="object"
                    entityName='Objects'
                    columns={DataTable2.columns(
                        DataTable2.column("name", row => row.name, "name", row => <XStack id={"objects-datatable-" + row.name}><Text>{row.name}</Text></XStack>),
                        DataTable2.column("features", row => row.features, "features", row => Object.keys(row.features).map(f => <Chip mr={"$2"} text={f} color={'$gray5'} />)),
                    )}
                    extraFieldsFormsAdd={{
                        api: z.boolean()
                            .after("keys")
                            .label("automatic crud api")
                            .defaultValue(true),
                        databaseType: z.union([z.literal("LevelDB"), z.literal("Google Sheets"), z.literal("JSON File")])
                            .after("keys")
                            .label("database type")
                            .defaultValue("LevelDB")
                            .visible((displayType, object) => object?.data?.api),
                        param: z.string()
                            .after("keys")
                            .label("Google Sheet Link")
                            .hint("https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit?usp=sharing")
                            .visible((displayType, object) => object?.data?.api && object?.data?.databaseType === "Google Sheets"),
                        adminPage: z.boolean()
                            .after("keys")
                            .label("admin page")
                            .defaultValue(true)
                            .visible((displayType, object) => object?.data?.api),
                    }}
                    // hideAdd={true}
                    model={ObjectModel}
                    pageState={pageState}
                    icons={ObjectIcons}
                    deleteable={(element) => {
                        if (Array.isArray(element)) {
                            for (const ele of element) {
                                if (Object.keys(ele.features).length !== 0) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return Object.keys(element.data.features).length === 0
                        }
                    }
                    }

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
        component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData, object }: any) => {
            const objExists = object ? true : false
            let objModel = null
            let apiUrl = null
            if(objExists) {
                objModel = ProtoModel.getClassFromDefinition(object)
                const {name, prefix} = objModel.getApiOptions()
                console.log("Object API options", {name, prefix})
                apiUrl = prefix + name
            }

            // const {name, prefix} = Objects.inventory.getApiOptions()
            // const apiUrl = prefix + name
            return (<AdminPage title={"Object " + object?.name} workspace={workspace} pageSession={pageSession}>
                {!objExists ? <ErrorMessage msg="Object not found" /> : null}
                {objExists ? <DataView
                    rowIcon={Tag}
                    sourceUrl={apiUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name={object?.name}
                    model={objModel}
                    pageState={pageState}
                    hideFilters={false}
                /> : null}
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async (session) => {
            return {
                object: (await API.get(`/api/core/v1/objects/${context.params.object}?token=` + session?.token))?.data
            }
        }))
    }
}