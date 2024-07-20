
import { withSession } from '../../lib/Session';
import { Tinted } from '../../components/Tinted';
import { useTint } from '../../lib/Tints';
import { JSONViewer } from '../../components/jsonui';
import { Center } from '../../components/Center';
import { SSR } from '../../lib/SSR';
import { AdminPage } from 'app/layout/AdminPage';
import { useSubscription } from '../../lib/mqtt';
import { H2, XStack, YStack, Text, Paragraph } from '@my/ui';
import { useState } from 'react';
import { useInterval, useUpdateEffect } from 'usehooks-ts';
import { Radio } from '@tamagui/lucide-icons'

const MessageList = ({ data, topic }) => {
    return <XStack padding="$3" marginLeft={"$0"} alignItems="center" justifyContent="center">
        {/* <YStack justifyContent="center" marginRight="$4"><MessageSquare color="var(--color7)" strokeWidth={1} /></YStack> */}
        <YStack>
            <XStack left={-6} hoverStyle={{ backgroundColor: "$color6" }} cursor="pointer" alignItems="center" marginBottom="$2" paddingVertical={3} paddingHorizontal="$2" borderRadius={4} width="fit-content" marginLeft={"$3"}>
                <XStack alignItems="center" hoverStyle={{ opacity: 1 }} opacity={0.9}>
                    <Radio color="var(--color7)" strokeWidth={2} size={20} />
                    <Text marginLeft={"$2"} opacity={0.9} fontSize={14} fontWeight={"500"}>{topic}</Text>
                </XStack>
                {/* <Chip width="fit-content" text={m.topic} color={'$color5'} /> */}
            </XStack>
            {/* <Chip width="fit-content" text={m.topic} color={'$color5'} /> */}
            {/* <Text>{m.message}</Text> */}
            <JSONViewer
                onChange={() => { }}
                editable={false}
                data={data}
                key={JSON.stringify(data)}
                collapsible
                compact={false}
                defaultCollapsed={false}
            //collapsedNodes={{0:{root: true}}}
            />
        </YStack>
    </XStack>
}

const EmptyMessage = () => {
    const [opacity, setOpacity] = useState(0.3)

    useInterval(() => { setOpacity(opacity == 0.3 ? 0.1 : 0.3) }, 500)
    return <Tinted>
        {/* @ts-ignore */}
        <XStack opacity={opacity} animation={"lazy"}>
            {/* <Spinner opacity={0.5} color="$color10" size='large' scale={3} /> */}
            <Radio strokeWidth={1.4} size={100} />
        </XStack>
        <H2 opacity={0.3} fontSize={20} marginTop={10} fontWeight={"400"}>Waiting for messages</H2>
    </Tinted>
}
export default {
    'messages': {
        component: ({ pageSession }: any) => {
            const [messages, setMessages] = useState([])
            const [filter, setFilter] = useState("")
            const { topic, client, message } = useSubscription('#');
            const { tint } = useTint()

            useUpdateEffect(() => {
                setMessages([message, ...messages])
            }, [message])

            const parseMessage = (msg) => {
                let parsed;
                try {
                    parsed = JSON.parse(msg)
                } catch (e) {
                    parsed = msg + ""
                }
                return parsed
            }
            const filteredMessages = messages.filter((m) => !filter || JSON.stringify(m).includes(filter))
            return (<AdminPage title="Messages" pageSession={pageSession}>
                <YStack flex={1}>

                    <XStack paddingTop="$3" paddingHorizontal="$7" marginBottom="$5">
                        <XStack left={-12} top={9} flex={1} alignItems="center">
                            <Paragraph>
                                <Text fontSize="$5" color="$color11">Messages [<Tinted><Text fontSize={"$5"} opacity={1} color="$color10">{filteredMessages.length}</Text></Tinted>]</Text>
                            </Paragraph>
                        </XStack>
                    </XStack>
                    {!filteredMessages.length && <Center top={-100}>
                        <EmptyMessage />
                    </Center>}
                    {filteredMessages.map((m, i) => {
                        const data = parseMessage(m.message)
                        return <XStack hoverStyle={{ backgroundColor: "$" + tint + "4" }} key={i} borderTopWidth={!i ? 1 : 0} borderBottomWidth={1} borderColor={"$color4"}>
                            <Tinted>
                                <MessageList data={data} topic={m.topic} />
                            </Tinted>
                        </XStack>
                    })}
                </YStack>
            </AdminPage>)
        },

        getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
    }
}