
import { ObjectModel } from '.'
import { DataView, DataTable2, Chip, API, AdminPage, PaginatedDataSSR } from 'protolib'
import { Pencil, Box } from '@tamagui/lucide-icons';
import { usePageParams } from '../../next';
import { XStack, Text } from "@my/ui";
import { z } from 'protolib/base'


const format = 'YYYY-MM-DD HH:mm:ss'
const ObjectIcons = {}
const rowsPerPage = 20

const sourceUrl = '/adminapi/v1/objects'

export default {
    'objects': {
        component: ({ pageState, initialItems, pageSession }: any) => {
            const { replace } = usePageParams(pageState)

            return (<AdminPage title="Objects" pageSession={pageSession}>
                <DataView
                    integratedChat
                    rowIcon={Box}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="object"
                    columns={DataTable2.columns(
                        DataTable2.column("name", row => row.name, "name", row => <XStack id={"objects-datatable-" + row.name}><Text>{row.name}</Text></XStack>),
                        DataTable2.column("features", row => row.features, "features", row => Object.keys(row.features).map(f => <Chip text={f} color={'$gray5'} />)),
                    )}
                    extraFieldsFormsAdd={{
                        api: z.boolean().after("keys").label("automatic crud api").defaultValue(true),
                        adminPage: z.boolean().after("keys").label("admin page").defaultValue(true),
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
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/objects', ['admin'], {
            orderBy: 'name'
        })
    }
}