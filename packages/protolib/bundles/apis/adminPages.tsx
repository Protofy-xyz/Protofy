import { APIModel } from '.'
import { DataTable2, API, DataView, AlertDialog, AdminPage } from 'protolib'
import { YStack, Text, Stack, XStack, Accordion, Spacer, Square, ScrollView, useToastController } from "@my/ui";
import { ToyBrick, Eye, ChevronDown } from '@tamagui/lucide-icons'
import { z } from 'protolib/base'
import { usePageParams } from '../../next'
import { withSession } from '../../lib/Session'
import { usePrompt } from '../../context/PromptAtom'
import { Chip } from '../../components/Chip'
import { useState } from 'react'
import Center from '../../components/Center'
import { Objects } from "app/bundles/objects";
import { Tinted } from '../../components/Tinted';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { getPendingResult } from '../../base';
import { SSR } from '../../lib/SSR';
import { Slides } from '../../components/Slides';
import { apiTemplates } from 'app/bundles/templates'
import { TemplateCard } from './TemplateCard';
import { EditableObject } from '../../components/EditableObject';

const APIIcons = {}

const SelectGrid = ({ children }) => {
    return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
        {children}
    </XStack>
}
const FirstSlide = ({ selected, setSelected }) => {
    return <YStack>
        <ScrollView mah={"500px"}>
            <SelectGrid>
                {Object.entries(apiTemplates).map(([templateId, template]) => (
                    <TemplateCard
                        template={template}
                        isSelected={selected === templateId}
                        onPress={() => setSelected(templateId)}
                    />
                ))}
            </SelectGrid>
        </ScrollView>
        <Spacer marginBottom="$8" />
    </YStack>
}

const SecondSlide = ({ data, setData, error, setError, objects }) => {
    return <ScrollView height={"200px"}>
        <EditableObject
            externalErrorHandling={true}
            error={error}
            setError={setError}
            data={data}
            setData={setData}
            numColumns={2}
            mode={'add'}
            title={false}
            model={APIModel}
            extraFields={apiTemplates[data['data'].template].extraFields ? apiTemplates[data['data'].template].extraFields(objects) : {}}
        />
    </ScrollView>
}

const AccordionMethod = ({ method, path, description, children }) => {
    const [opened, setOpened] = useState([''])

    return (<Accordion onValueChange={(opened) => setOpened(opened)} onPress={(e) => e.stopPropagation()} type="multiple" boc={"$gray6"} f={1} mb={"$5"} width={"640px"}>
        <Accordion.Item br="$5" bw={1} boc={"$gray6"} value={"item"}>
            <Accordion.Trigger p={0} px={8} height={43} bc="$transparent" focusStyle={{ bc: "$transparent" }} br={opened.includes("item") ? "$0" : '$5'} btlr="$5" btrr="$5" bw="$0" flexDirection="row" ai="center">
                {({ open }) => (
                    <>
                        <Stack mt={"$2"}>
                            <MethodBadge
                                method={method}
                                path={path}
                                description={description}
                            />
                        </Stack>

                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                            <ChevronDown size="$1" />
                        </Square>
                    </>
                )}
            </Accordion.Trigger>
            <Accordion.Content f={1} br="$5">
                {children}
            </Accordion.Content>
        </Accordion.Item>
    </Accordion>)
}

const QueryParams = ({ query, desc }) => {
    return (<Tinted>
        <XStack mb="$3" mt="$3">
            <Chip text={query} color={'$color5'} mr="$3" h={25} w={"100px"} />
            <Text> {desc}</Text>
        </XStack>
    </Tinted>)
}

const MethodBadge = ({ method, path, description }) => {
    return (
        <Tinted>
            <XStack
                padding={10}
                marginVertical={5}
                width={"600px"}
                ai="center"
                mb={"$3"}
                pr={"$10"}
            >
                <XStack alignItems="center" space>

                    <Stack p={"$1"} backgroundColor={method === 'GET' ? '$color8' : '$color7'} br={"$2"}>
                        <Text fontSize={14} fontWeight="bold" color="white" padding={5} borderRadius={5} >
                            {method}
                        </Text>
                    </Stack>

                    <Text fontWeight="bold" flex={1}>
                        {path}
                    </Text>
                </XStack>
                <XStack ml={"$3"}>
                    <Text color="$grey" fontSize={14}>
                        {description}
                    </Text>
                </XStack>

            </XStack>
        </Tinted>
    );
};

const sourceUrl = '/adminapi/v1/apis'
const objectsSourceUrl = '/adminapi/v1/objects?all=1'

export default {
    'apis': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const { replace } = usePageParams(pageState ?? {})
            usePrompt(() => `At this moment the user is browsing the Rest API management page. The Rest API management page allows to list, create, read, update and delete API definitions. API definitions are typescript files using express.
            The system allows to create APIs either from an empty template, or from an AutoCRUD template. The automatic crud template creates an automatic CRUD API for a given object. 
            To Automatic CRUD API generates the following endpoints: get /api/v1/:objectName (list), post /api/v1/:objectName (create), post /api/v1/:objectName/:objectId (update), get /api/v1/:objectName/:objectId/delete (delete) and get /api/v1/:objectName/:objectId (read)
            the API files are located at /packages/app/bundles/custom/apis. 
            The Automatic CURD system can be manually extended to have more endpoints.
            The user can edit the API files by clicking on any API, and can choose visual programming using interactive diagrams generated from the source code, or text based tradicional programming to edit the .ts api file.
            Those APIs allow the user to create pages based on object data. The automatic crud is an "storage" to manage data for a specific object.
            ` + (
                    initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
                ))

            const defaultData = { data: { template: 'custom-api' } }

            const [dialogOpen, setDialogOpen] = useState(false)
            const [objects, setObjects] = useState(extraData?.objects ?? getPendingResult('pending'))
            const [currentElement, setCurrentElement] = useState({})
            const [addOpen, setAddOpen] = useState(false)
            const [data, setData] = useState(defaultData)
            const [error, setError] = useState<any>('')
            const toast = useToastController()

            let options: any = {}
            const ObjectModel = currentElement?.data?.object ? Objects[currentElement?.data?.object] : null
            if (ObjectModel) {
                options = ObjectModel.getApiOptions()
            }
            usePendingEffect((s) => { API.get({ url: objectsSourceUrl }, s) }, setObjects, extraData?.objects)

            return (<AdminPage title="Automations" pageSession={pageSession}>
                <AlertDialog
                    integratedChat
                    p={"$2"}
                    pt="$5"
                    pl="$5"
                    setOpen={setAddOpen}
                    open={addOpen}
                    hideAccept={true}
                    description={""}
                >
                    <YStack f={1} jc="center" ai="center">
                        <XStack mr="$5">
                            <Slides
                                lastButtonCaption="Create"
                                id='apis'
                                onFinish={async () => {
                                    try {
                                        //TODO: when using custom data and setData in editablectObject
                                        //it seems that defaultValue is no longer working
                                        //we are going to emulate it here until its fixed
                                        const obj = APIModel.load(data['data'])
                                        if (apiTemplates[data['data'].template].extraValidation) {
                                            const check = apiTemplates[data['data'].template].extraValidation(data['data'])
                                            if (check?.error) {
                                                throw check.error
                                            }
                                        }
                                        const result = await API.post(sourceUrl, obj.create().getData())
                                        if (result.isError) {
                                            throw result.error
                                        }
                                        setAddOpen(false);
                                        toast.show('Automation created', {
                                            message: obj.getId()
                                        })
                                    } catch (e) {
                                        setError(getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e))
                                    }
                                }}
                                slides={[
                                    {
                                        name: "Create new Automation",
                                        title: "Select your Template",
                                        component: <FirstSlide selected={data?.data['template']} setSelected={(tpl) => setData({ ...data, data: { ...data['data'], template: tpl } })} />
                                    },
                                    {
                                        name: apiTemplates[data?.data['template']]['name'],
                                        title: "Configure your Automation",
                                        component: <SecondSlide error={error} objects={objects} setError={setError} data={data} setData={setData} />
                                    }
                                ]
                                }></Slides>
                        </XStack>
                    </YStack>
                </AlertDialog>
                <AlertDialog
                    acceptCaption="Close"
                    cancelCaption="Keep editing"
                    onAccept={async () => {

                    }}
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    title={"API Endpoints"}
                    description=""
                >
                    <ScrollView maxHeight={"80vh"}>
                        <Center mt="$5">
                            <YStack>
                                <AccordionMethod
                                    method="GET"
                                    path={options ? options.prefix + options.name : ""}
                                    description={"List all " + currentElement?.data?.name + " entries"}>
                                    <Text mb={"$3"} mt={"$"}>
                                        The list API endpoint is designed to provide a paginated, ordered list of items from a dataset. It accepts several query parameters that allow you to customize the response.
                                    </Text>
                                    <QueryParams query={"itemsPerPage"} desc={"Defines max items returned per page; defaults to 25."}></QueryParams>
                                    <QueryParams query={"page"} desc={"Selects which page of results to retrieve, starting at 0."}></QueryParams>
                                    <QueryParams query={"orderBy"} desc={"Specifies field name to sort the results by."}></QueryParams>
                                    <QueryParams query={"orderDirection"} desc={"Sets sort direction, ascending ('asc') by default, use 'desc' for descending."}></QueryParams>
                                    <QueryParams query={"all"} desc={"If set, returns all results, bypassing pagination."}></QueryParams>
                                </AccordionMethod>

                                <AccordionMethod
                                    method="GET"
                                    path={options ? options.prefix + options.name + "/:id" : ""}
                                    description={"Reads a " + currentElement?.data?.name + " entry by id"}>
                                    <Text mb={"$3"} mt={"$"}>
                                        This 'read' endpoint is used to fetch a specific item based on its unique id. It implements security checks and custom data transformations.
                                    </Text>
                                    <QueryParams query={":id"} desc={"The unique id of the item to be retrieved from the dataset."}></QueryParams>

                                </AccordionMethod>

                                <AccordionMethod
                                    method="POST"
                                    path={options ? options.prefix + options.name : ""}
                                    description={"Creates a new " + currentElement?.data?.name + " entry"}>
                                    <Text mb={"$3"} mt={"$"}>
                                        The 'create' endpoint is utilized for adding new items to the dataset. It includes data transformations, and event notifications for successful creations.
                                    </Text>
                                </AccordionMethod>

                                <AccordionMethod
                                    method="POST"
                                    path={options ? options.prefix + options.name + "/:id" : ""}
                                    description={"Updates a " + currentElement?.data?.name + " entry by id"}>
                                    <Text mb={"$3"} mt={"$"}>
                                        The 'update' endpoint is used for modifying existing items based on their unique id. It includes data transformation processes, and notifications for each update action.
                                    </Text>
                                    <QueryParams query={":id"} desc={"The unique id of the item to be updated in the dataset."}></QueryParams>
                                </AccordionMethod>

                                <AccordionMethod
                                    method="POST"
                                    path={options ? options.prefix + options.name + "/:id/delete" : ""}
                                    description={"Deletes a " + currentElement?.data?.name + " entry by id"}>
                                    <Text mb={"$3"} mt={"$"}>
                                        The 'delete' endpoint facilitates the removal of items based on their unique id. It encompasses transformations of the data for deletion, and event notifications for the action performed.
                                    </Text>
                                    <QueryParams query={":id"} desc={"The unique id of the item to be deleted from the dataset."}></QueryParams>
                                </AccordionMethod>

                            </YStack>
                        </Center>
                    </ScrollView>
                </AlertDialog>
                <DataView
                    integratedChat
                    onSelectItem={(item) => replace('editFile', '/packages/app/bundles/custom/apis/' + item.data.name + '.ts')}
                    rowIcon={ToyBrick}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="Automation"
                    columns={DataTable2.columns(
                        DataTable2.column("name", row => row.name, true, row => <XStack id={"apis-datatable-" + row.name}><Text>{row.name}</Text></XStack>),
                        DataTable2.column("type", row => row.type, true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'AutoAPI' ? '$color5' : '$gray5'} />),
                        DataTable2.column("object", row => row.object, true, row => <Chip text={row.object} color={row.object == 'None' ? '$gray5' : '$color5'} />),
                    )}
                    onAddButton={() => setAddOpen(true)}
                    extraMenuActions={[
                        {
                            text: "View API details",
                            icon: Eye,
                            action: (element) => { setDialogOpen(true); setCurrentElement(element); console.log("DATA", element) },
                            isVisible: (data) => data.data.type === "AutoAPI" ? true : false
                        }
                    ]}
                    model={APIModel}
                    pageState={pageState}
                    icons={APIIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
    }
}