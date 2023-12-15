import { PageModel } from '.'
import { DataView } from 'protolib'
import { DataTable2, Chip, API, InteractiveIcon, AdminPage, PaginatedDataSSR, NextLink } from 'protolib'
import { z } from 'protolib/base'
import { Paragraph, XStack, YStack, useThemeName } from '@my/ui'
import { ExternalLink, Pencil } from '@tamagui/lucide-icons'
import { usePageParams } from '../../next';
import { getURLWithToken } from '../../lib/Session'
import { useState } from 'react'
import { getPendingResult } from '../../base'
import { usePendingEffect } from '../../lib/usePendingEffect'
import { Tinted } from '../../components/Tinted'
import { Button, Image, ScrollView } from 'tamagui'
import { useRouter } from 'next/router'
import { AlertDialog } from '../../components/AlertDialog'
import { Slides } from '../../components/Slides'

const environments = require('../../../app/bundles/environments')

const PageIcons = {}
const sourceUrl = '/adminapi/v1/pages'
const objectsSourceUrl = '/adminapi/v1/objects?all=1'
const templates = ["blank", "default", "admin"]

const slides = [
    {
        name: "Create new page",
        title: "Select your Template",
        component: <h1>step 1</h1>
    },
    {
        name: "Configure your page",
        title: "Configure your page",
        component: <h1>step 2</h1>
    },
    {
        name: "lil",
        title: "step 3",
        component: <h1>step 3</h1>
    }
]

const TemplatePreview = ({ template, isSelected, onPress, theme }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const templateUrl = `https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/${template}-${theme}.png`
    return (
        <YStack onPress={onPress} onHoverIn={() => setPreviewVisible(true)} onHoverOut={() => setPreviewVisible(false)} overflow='hidden' borderWidth={isSelected ? "$1" : "$0.5"} borderColor={isSelected ? "$color7" : "$gray8"} f={1} cursor='pointer' borderRadius={"$3"}>
            <Image
                source={{ height: 120, width: 238, uri: templateUrl }}
            />
            <YStack
                display={previewVisible ? 'block' : 'none'}
                zi={10000}
                position='absolute'
                right={"$2"}
                top={"$2"}
            >
                <NextLink target="_blank" href={templateUrl}>
                    <Button
                        backgroundColor={"$color7"}
                        size="$1.5" borderRadius={"$1"}
                        px="$2" textProps={{ size: "$1" }}
                        onPress={(e) => {
                            e.stopPropagation()
                        }}
                    // iconAfter={<Eye size="$1" color="$color7" />}
                    >preview</Button>
                </NextLink>
            </YStack>
            <XStack jc='space-between' borderTopWidth={"$0.5"} borderColor={"$gray8"} backgroundColor={"$gray3"} py="$1" px="$2">
                <Paragraph>{template}</Paragraph>
            </XStack>
        </YStack>
    )
}

const SelectGrid = ({ children }) => {
    return <Tinted>
        <div
            style={{
                gap: 20,
                display: 'grid',
                gridTemplateColumns: `repeat( auto-fill, minmax(230px, 1fr) )`,
            }}
        >
            {children}
        </div>
    </Tinted>
}

export default {
    'admin/pages': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const router = useRouter();
            const { replace } = usePageParams(pageState)
            const [objects, setObjects] = useState(extraData?.objects ?? getPendingResult('pending'))
            const [addOpen, setAddOpen] = useState(false)
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
                                <Slides slides={slides}></Slides>
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
                        DataTable2.column("name", "name", true),
                        DataTable2.column("route", "route", true),
                        DataTable2.column("visibility", "protected", true, row => !row.protected ? <Chip text={'public'} color={'$color5'} /> : <Chip text={'protected'} color={'$gray5'} />),
                        DataTable2.column("permissions", "permissions", true, row => row.permissions.map((p, k) => <XStack key={k} ml={k ? 10 : 0}><Chip text={p} color={'$gray5'} /></XStack>)),
                    )}
                    extraFieldsFormsAdd={{
                        //@ts-ignore
                        template: z.union(templates?.map((t: string) => z.literal(t))).after("route").size(2),
                        object: z.union([z.literal("without object"), ...(objects && objects.data ? objects.data?.items.filter(o => o.features && o.features['AutoAPI']).map(o => z.literal(o.name)) : [])] as any).after('route'),
                    }}
                    // onAddButton={() => { setAddOpen(true) }}
                    extraMenuActions={[
                        {
                            text: "Edit Page file",
                            icon: Pencil,
                            action: (element) => { replace('editFile', element.getDefaultFilePath()) },
                            isVisible: (data) => true
                        }
                    ]}
                    customFields={{
                        template: {
                            component: (path, data, setData) => {
                                const themeName = useThemeName();
                                return (
                                    <SelectGrid>
                                        {
                                            templates.map((template) => <TemplatePreview theme={themeName} template={template} isSelected={data == template} onPress={() => setData(template)} />)
                                        }
                                    </SelectGrid>
                                )
                            }
                        }
                    }}
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