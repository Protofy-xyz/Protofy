import { PageModel } from '.'
import { DataView } from 'protolib'
import { DataTable2, Chip, API, InteractiveIcon, AdminPage, PaginatedDataSSR } from 'protolib'
import { z } from 'protolib/base'
import { XStack, YStack, useThemeName, useToastController } from '@my/ui'
import { ExternalLink, Pencil } from '@tamagui/lucide-icons'
import { usePageParams } from '../../next';
import { getURLWithToken } from '../../lib/Session'
import { useState } from 'react'
import { getPendingResult } from '../../base'
import { usePendingEffect } from '../../lib/usePendingEffect'
import { ScrollView } from 'tamagui'
import { useRouter } from 'next/router'
import { AlertDialog } from '../../components/AlertDialog'
import { Slides } from '../../components/Slides'
import { EditableObject } from '../../components/EditableObject'
import { useUpdateEffect } from 'usehooks-ts'
import TemplatePreview from './TemplatePreview'

const environments = require('../../../app/bundles/environments')

const PageIcons = {}
const sourceUrl = '/adminapi/v1/pages'
const objectsSourceUrl = '/adminapi/v1/objects?all=1'

const templates = {
    "blank": {},
    "default": {},
    "admin": {
        extraFields: (objects) => ({
            object: z.union([z.literal("without object"), ...(objects && objects.data ? objects.data?.items.filter(o => o.features && o.features['AutoAPI']).map(o => z.literal(o.name)) : [])] as any).after('route')
        }),
        extraValidation: (data) => {
            if (!Object.keys(data).includes('object')) {
                return {error: "object cant be empty"}
            }
            return
        }
    },
    "landing": {},
    "ecomerce": {},
}

const SelectGrid = ({ children }) => {
    return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
        {children}
    </XStack>
}

const FirstSlide = ({ selected, setSelected }) => {
    const themeName = useThemeName();
    return <SelectGrid>
        {Object.keys(templates).map((template) => <TemplatePreview theme={themeName} template={template} isSelected={selected == template} onPress={() => setSelected(template)} />)}
    </SelectGrid>
}

const SecondSlide = ({ data, setData, error, setError, objects }) => {
    return <EditableObject
        externalErrorHandling={true}
        error={error}
        setError={setError}
        data={data}
        setData={setData}
        name={"page"}
        numColumns={2}
        mode={'add'}
        title={""}
        model={PageModel}
        extraFields={templates[data['data'].template].extraFields ? templates[data['data'].template].extraFields(objects) : {}}
    />
}

export default {
    'pages': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const defaultData = { data: { web: true, electron: false, protected: false, template: 'blank' } }
            const router = useRouter();
            const { replace } = usePageParams(pageState)
            const [objects, setObjects] = useState(extraData?.objects ?? getPendingResult('pending'))
            const [addOpen, setAddOpen] = useState(false)
            const themeName = useThemeName();
            const [data, setData] = useState(defaultData)
            const toast = useToastController()
            const [error, setError] = useState<any>('')

            useUpdateEffect(() => {
                setError('')
                setData(defaultData)
            }, [addOpen])

            usePendingEffect((s) => { API.get({ url: objectsSourceUrl }, s) }, setObjects, extraData?.objects)


            const getUrl = (route) => {
                const environment = environments[document.location.hostname.split('.')[0]]
                return environment && environment.baseUrl ? environment.baseUrl + route : route
            }

            return (<AdminPage title="Pages" pageSession={pageSession}>
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
                        <ScrollView maxHeight={"90vh"}>
                            <XStack mr="$5">
                                <Slides
                                    lastButtonCaption="Create"
                                    onFinish={async () => {
                                        try {
                                            //TODO: when using custom data and setData in editablectObject
                                            //it seems that defaultValue is no longer working
                                            //we are going to emulate it here until its fixed
                                            const obj = PageModel.load(data['data'])
                                            if (templates[data['data'].template].extraValidation) {
                                                const check = templates[data['data'].template].extraValidation(data['data'])
                                                if (check?.error) {
                                                    throw check.error
                                                }
                                            }
                                            const result = await API.post(sourceUrl, obj.create().getData())
                                            if (result.isError) {
                                                throw result.error
                                            }
                                            setAddOpen(false);
                                            toast.show('Page created', {
                                                message: obj.getId()
                                            })
                                        } catch (e) {
                                            console.log('original error: ', e)
                                            setError(getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e))
                                        }
                                    }}
                                    slides={[
                                        {
                                            name: "Create new page",
                                            title: "Select your Template",
                                            component: <FirstSlide selected={data?.data['template']} setSelected={(tpl) => setData({ ...data, data: { ...data['data'], template: tpl } })} />
                                        },
                                        {
                                            name: "Configure your page",
                                            title: "Configure your page",
                                            component: <SecondSlide error={error} objects={objects} setError={setError} data={data} setData={setData} />
                                        }
                                    ]
                                    }></Slides>
                            </XStack>
                        </ScrollView>
                    </YStack>
                </AlertDialog>

                <DataView
                    integratedChat
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="page"
                    rowIcon={() => <></>}
                    objectProps={{ columnWidth: 500 }}
                    columns={DataTable2.columns(
                        DataTable2.column("", "", true, (row) => <a href={getUrl(row.route.startsWith('/') ? row.route : '/' + row.route)} target='_blank'>
                            <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
                        </a>, true, '50px'),
                        DataTable2.column("name", "name", true, (row) => <XStack id={"pages-datatable-" + row.name}>{row.name}</XStack>),
                        DataTable2.column("route", "route", true),
                        DataTable2.column("visibility", "protected", true, row => !row.protected ? <Chip text={'public'} color={'$color5'} /> : <Chip text={'protected'} color={'$gray5'} />),
                        DataTable2.column("permissions", "permissions", true, row => row.permissions.map((p, k) => <XStack key={k} ml={k ? 10 : 0}><Chip text={p} color={'$gray5'} /></XStack>)),
                    )}
                    onAddButton={() => { setAddOpen(true) }}
                    extraMenuActions={[
                        {
                            text: "Edit Page file",
                            icon: Pencil,
                            action: (element) => { replace('editFile', element.getDefaultFilePath()) },
                            isVisible: (data) => true
                        }
                    ]}
                    model={PageModel}
                    pageState={pageState}
                    icons={PageIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedDataSSR(sourceUrl, ['admin'], {}, async (context) => {
            return {
                objects: await API.get(getURLWithToken(objectsSourceUrl, context))
            }
        })
    }
}