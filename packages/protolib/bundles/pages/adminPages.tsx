import { PageModel } from '.'
import { DataView } from 'protolib/components/DataView'
import {DataTable2} from 'protolib/components/DataTable2'
import {Chip} from 'protolib/components/Chip'
import {API} from 'protolib/base/Api'
import {InteractiveIcon} from 'protolib/components/InteractiveIcon'
import {AdminPage} from 'protolib/components/AdminPage'
import {useWorkspaceEnv} from 'protolib/lib/useWorkspaceEnv'
import { z } from 'protolib/base/BaseSchema'
import { XStack, YStack, useThemeName, useToastController, ScrollView, Spacer, Text } from '@my/ui'
import { ExternalLink, Pencil } from '@tamagui/lucide-icons'
import { usePageParams } from '../../next';
import { useState } from 'react'
import { getPendingResult } from '../../base'
import { usePendingEffect } from '../../lib/usePendingEffect'
import { AlertDialog } from '../../components/AlertDialog'
import { Slides } from '../../components/Slides'
import { EditableObject } from '../../components/EditableObject'
import { useUpdateEffect } from 'usehooks-ts'
import { TemplatePreview } from './TemplatePreview'
import { pageTemplates } from 'app/bundles/templates'
import { SiteConfig } from 'app/conf'
import { PaginatedData } from '../../lib/SSR'

const PageIcons = {}
const sourceUrl = '/adminapi/v1/pages'
const objectsSourceUrl = '/adminapi/v1/objects?all=1'

const SelectGrid = ({ children }) => {
    return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
        {children}
    </XStack>
}

const FirstSlide = ({ selected, setSelected }) => {
    const themeName = useThemeName();
    return <YStack>
        <ScrollView mah={"500px"}>
            <SelectGrid>
                {Object.entries(pageTemplates).map(([templateId, template]) => (
                    <TemplatePreview
                        theme={themeName}
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
        extraFields={pageTemplates[data['data'].template].extraFields ? pageTemplates[data['data'].template].extraFields(objects) : {}}
    />
}

export default {
    'pages': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const env = useWorkspaceEnv()
            const defaultData = { data: { web: true, electron: false, protected: false, template: 'blank' } }
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
            const host = typeof window !== 'undefined' ? window.location.hostname : ''
            const protocol = typeof window !== 'undefined' ? window.location.protocol : ''

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
                        {/* <ScrollView maxHeight={"90vh"}> */}
                        <XStack mr="$5">
                            <Slides
                                lastButtonCaption="Create"
                                onFinish={async () => {
                                    try {
                                        //TODO: when using custom data and setData in editablectObject
                                        //it seems that defaultValue is no longer working
                                        //we are going to emulate it here until its fixed
                                        const obj = PageModel.load(data['data'])
                                        if (pageTemplates[data['data'].template].extraValidation) {
                                            const check = pageTemplates[data['data'].template].extraValidation(data['data'])
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
                        {/* </ScrollView> */}
                    </YStack>
                </AlertDialog>

                <DataView
                    openMode={env === 'dev' ? 'edit' : 'view'}
                    hideAdd={env !== 'dev'}
                    disableItemSelection={env !== 'dev'}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="page"
                    rowIcon={() => <></>}
                    objectProps={{ columnWidth: 500 }}
                    columns={DataTable2.columns(
                        DataTable2.column("", () => "", false, (row) => {
                            let route = row.route.startsWith('/') ? row.route : '/' + row.route
                            const parts = route.split('/')
                            if(parts.length > 2 && parts[1] == 'workspace') {
                                route = '/workspace/'+env+'/'+parts.slice(2).join('/')
                            }
                            
                            if(env == 'dev') {
                                route = SiteConfig.getDevelopmentURL(route, document?.location.protocol, document?.location.hostname)
                            }

                            return <a href={route} target='_blank'>
                                <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
                            </a>
                        }, true, '50px'),
                        DataTable2.column("name", row => row.name, "name", (row) => <XStack id={"pages-datatable-" + row.name}><Text>{row.name}</Text></XStack>),
                        DataTable2.column("route", row => row.route, "route"),
                        DataTable2.column("visibility", row => row.protected, "protected", row => !row.protected ? <Chip text={'public'} color={'$color5'} /> : <Chip text={'protected'} color={'$gray5'} />),
                        DataTable2.column("permissions", row => row.permissions, "permissions", row => row.permissions.map((p, k) => <XStack key={k} ml={k ? 10 : 0}><Chip text={p} color={'$gray5'} /></XStack>)),
                    )}
                    onAddButton={() => { setAddOpen(true) }}
                    extraMenuActions={env == 'dev' ? [
                        {
                            text: "Edit Page file",
                            icon: Pencil,
                            action: (element) => { replace('editFile', element.getDefaultFilePath()) },
                            isVisible: (data) => true
                        }
                    ] : []}
                    model={PageModel}
                    pageState={pageState}
                    icons={PageIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedData(sourceUrl, ['admin'], { objects: objectsSourceUrl })
    }
}