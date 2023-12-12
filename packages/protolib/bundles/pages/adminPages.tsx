
import { PageModel } from '.'
import { DataView } from 'protolib'
import { DataTable2, Chip, API, InteractiveIcon, AdminPage, PaginatedDataSSR, Image } from 'protolib'
import { z } from 'protolib/base'
import { XStack, YStack, useThemeName } from '@my/ui'
import { ExternalLink, Pencil } from '@tamagui/lucide-icons'
import { usePageParams } from '../../next';
import { getURLWithToken } from '../../lib/Session'
import { useState } from 'react'
import { getPendingResult } from '../../base'
import { usePendingEffect } from '../../lib/usePendingEffect'
import { Tinted } from '../../components/Tinted'
const environments = require('../../../app/bundles/environments')

const PageIcons = {}
const sourceUrl = '/adminapi/v1/pages'
const objectsSourceUrl = '/adminapi/v1/objects?all=1'
const templates = ["blank", "default", "admin"]

export default {
    'admin/pages': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const { replace } = usePageParams(pageState)
            const [objects, setObjects] = useState(extraData?.objects ?? getPendingResult('pending'))
            usePendingEffect((s) => { API.get({ url: objectsSourceUrl }, s) }, setObjects, extraData?.objects)

            const getUrl = (route) => {
                const environment = environments[document.location.hostname.split('.')[0]]
                return environment && environment.baseUrl ? environment.baseUrl + route : route
            }
            const TemplatePreview = ({ template, isSelected, onPress, theme }) => {
                return (
                    <YStack onPress={onPress} overflow='hidden' borderWidth={isSelected ? "$1": "$0.5"} borderColor={isSelected ? "$color7":"$gray8"} m="$2" h={130} f={1} cursor='pointer' borderRadius={"$4"}>
                        <Image width={"100%"} height={130} url={`https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/${template}-${theme}.png`} />
                    </YStack>
                )
            }

            return (<AdminPage title="Pages" pageSession={pageSession}>
                <DataView
                    integratedChat
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="page"
                    rowIcon={()=><></>}
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
                        template: z.union(templates?.map((t: string) => z.literal(t))).after("route"),
                        object: z.union([z.literal("without object"), ...(objects && objects.data ? objects.data?.items.filter(o => o.features && o.features['AutoAPI']).map(o => z.literal(o.name)) : [])] as any).after('route'),
                    }}
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
                                    <Tinted>
                                        <div
                                            style={{
                                                gap: 10,
                                                display: 'grid',
                                                gridTemplateColumns: `repeat( auto-fill, minmax(150px, 1fr) )`,
                                            }}
                                        >
                                            {
                                                templates.map((template) => <TemplatePreview theme={themeName} template={template} isSelected={data == template} onPress={() => setData(template)} />)
                                            }
                                        </div>
                                    </Tinted>
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