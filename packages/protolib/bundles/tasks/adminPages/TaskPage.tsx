
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { TaskModel } from '../models/Task'
import {DataView, DataTable2, Chip, API, withSession, Center, Tinted, AsyncView, EditableObject, getPendingResult} from 'protolib'
import { useRouter } from "next/router"
import { SSR } from 'app/conf'
import { H2, Paragraph, XStack, YStack } from '@my/ui'
import { AlertTriangle } from '@tamagui/lucide-icons'
import {z} from 'zod'

export const TaskPage = {
    component: ({pageSession, task, taskId, sourceUrl}:any) => {
        const router = useRouter()
        console.log('task: ', task)
        
        return (<AdminPage title="Tasks" pageSession={pageSession}>
            <AsyncView atom={task} error={<Center top={-100}>
                    <AlertTriangle size="$10"  />
                    <XStack>
                        <Tinted><H2 color="$color8" mt={"$5"}>Task</H2></Tinted>
                        <H2 mt={"$5"}>&nbsp;Not Found</H2>
                    </XStack>
                </Center>}>

                <YStack f={1} p={"$5"}>
                    <EditableObject
                        EditIconNearTitle={true}
                        autoWidth={true}
                        initialData={task}
                        name={'task'}
                        spinnerSize={75}
                        loadingText={<YStack ai="center" jc="center">Loading data for<Paragraph fontWeight={"bold"}>task</Paragraph></YStack>}
                        objectId={taskId}
                        sourceUrl={sourceUrl}
                        onSave={async (original, data) => {
                            try {
                                const result = await API.post(sourceUrl, data)
                                if (result.isError) {
                                    throw result.error
                                }
                            } catch (e) {
                                throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                            }
                        }}
                        model={TaskModel}
                        icons={{}}
                    />
                </YStack>
            </AsyncView>

        </AdminPage>)
    }, 

    getServerSideProps: SSR(async (context) => withSession(context, [], async () => {
        const task = await API.get('/adminapi/v1/tasks/'+context.query.name[2])
        return {
            task: task,
            taskId: context.query.name[2],
            sourceUrl: '/adminapi/v1/tasks/'+context.query.name[2]
        }
    }))
}