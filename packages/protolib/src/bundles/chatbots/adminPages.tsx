import { ChatbotModel } from './ChatbotSchemas';
import { YStack, Text, XStack, Spacer, ScrollView, useToastController } from "@my/ui";
import { ToyBrick } from '@tamagui/lucide-icons'
import { z, getPendingResult, API } from 'protobase'
import { usePageParams } from '../../next'
import { usePrompt } from '../../context/PromptAtom'
import { Chip } from '../../components/Chip'
import { DataTable2 } from '../../components/DataTable2'
import { DataView } from '../../components/DataView'
import { AlertDialog } from '../../components/AlertDialog'
import { AdminPage } from '../../components/AdminPage'
import { useState } from 'react'
import { PaginatedData } from '../../lib/SSR';
import { Slides } from '../../components/Slides';
import { chatbotTemplates } from '../templates'
import { TemplateCard } from '../apis/TemplateCard';
import { EditableObject } from '../../components/EditableObject';

const ChatbotIcons = {}

const SelectGrid = ({ children }) => {
    return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
        {children}
    </XStack>
}
const FirstSlide = ({ selected, setSelected }) => {
    return <YStack>
        <ScrollView mah={"500px"}>
            <SelectGrid>
                {Object.entries(chatbotTemplates).map(([templateId, template]) => (
                    <TemplateCard
                        key={templateId}
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

const SecondSlide = ({ data, setData, error, setError }) => {
    return <ScrollView height={"200px"}>
        <EditableObject
            externalErrorHandling={true}
            error={error}
            setError={setError}
            data={data}
            setData={setData}
            numColumns={chatbotTemplates[data['data'].template].extraFields ? 2 : 1}
            mode={'add'}
            title={false}
            model={ChatbotModel}
            extraFields={chatbotTemplates[data['data'].template].extraFields ? chatbotTemplates[data['data'].template].extraFields() : {}}
        />
    </ScrollView>
}

const sourceUrl = '/api/core/v1/chatbots'

export default {
    'chatbots': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const { replace } = usePageParams(pageState ?? {})
            usePrompt(() => `At this moment the user is browsing the Chatbot management page.` + (
                    initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
                ))

            const defaultData = { data: { template: 'custom-chatbot' } }
            const [total, setTotal] = useState(0)
            const [addOpen, setAddOpen] = useState(false)
            const [data, setData] = useState(defaultData)
            const [error, setError] = useState<any>('')
            const toast = useToastController()

            return (<AdminPage title="Chatbots" pageSession={pageSession}>
                <AlertDialog
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
                                id='chatbots'
                                onFinish={async () => {
                                    try {
                                        const obj = ChatbotModel.load(data['data'])
                                        if (chatbotTemplates[data['data'].template].extraValidation) {
                                            const check = chatbotTemplates[data['data'].template].extraValidation(data['data'])
                                            if (check?.error) {
                                                throw check.error
                                            }
                                        }
                                        const result = await API.post(sourceUrl, obj.create().getData())
                                        if (result.isError) {
                                            throw result.error
                                        }
                                        setAddOpen(false);
                                        toast.show('Chatbot created', {
                                            message: obj.getId()
                                        })
                                    } catch (e) {
                                        setError(getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e))
                                    }
                                }}
                                slides={[
                                    {
                                        name: "Create new Chatbot",
                                        title: "Select your Template",
                                        component: <FirstSlide selected={data?.data['template']} setSelected={(tpl) => setData({ ...data, data: { ...data['data'], template: tpl } })} />
                                    },
                                    {
                                        name: chatbotTemplates[data?.data['template']]['name'],
                                        title: "Configure your Chatbot",
                                        component: <SecondSlide error={error} setError={setError} data={data} setData={setData} />
                                    }
                                ]
                                }></Slides>
                        </XStack>
                    </YStack>
                </AlertDialog>
                <DataView
                    onDataAvailable={(total) => setTotal(total)}
                    onSelectItem={(item) => {
                        replace('editFile', item.data.filePath);
                    }}

                    rowIcon={ToyBrick}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="Chatbot"
                    columns={DataTable2.columns(
                        DataTable2.column("name", row => row.name, 'name', row => <XStack id={"apis-datatable-" + row.name}><Text>{row.name}</Text></XStack>),
                        DataTable2.column("type", row => row.type, 'type', row => <Chip text={row.type.toUpperCase()} color={row.type == 'AutoAPI' ? '$color5' : '$gray5'} />),
                        DataTable2.column("engine", row => row.engine, 'engine', row => <Chip text={row.engine} color={'$color5'} />),
                    )}
                    onAddButton={() => setAddOpen(true)}
                    model={ChatbotModel}
                    pageState={pageState}
                    icons={ChatbotIcons}
                />
            </AdminPage>)
        },

        getServerSideProps: PaginatedData(sourceUrl, ['admin'])
    }
}