
import { AdminPage } from 'protolib/adminpanel/features/next'
import { withSession, ObjectGrid, Tinted, useTint, Chip, JSONViewer, Center, SSR } from 'protolib'
import { useSubscription } from 'mqtt-react-hooks';
import { H2, Spacer, XStack, YStack, Text, Paragraph, Spinner } from '@my/ui';
import { useState } from 'react';
import { useInterval, useUpdateEffect } from 'usehooks-ts';
import { Mail, Tag, MessageSquare, Hash, Rss, RadioTower, Radio } from '@tamagui/lucide-icons'
import { Search } from '../../components/Search';

const MessageList = ({ data, topic }) => {
    return <XStack p="$3" ml={"$0"} ai="center" jc="center">
        {/* <YStack jc="center" mr="$4"><MessageSquare color="var(--color7)" strokeWidth={1} /></YStack> */}
        <YStack>
            <XStack left={-6} hoverStyle={{ bc: "$color6" }} cursor="pointer" ai="center" mb="$2" py={3} px="$2" br={4} width="fit-content" ml={"$3"}>
                <XStack ai="center" hoverStyle={{ o: 1 }} o={0.9}>
                    <Radio color="var(--color7)" strokeWidth={2} size={20} />
                    <Text ml={"$2"} o={0.9} fontSize={14} fontWeight={"500"}>{topic}</Text>
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
        <XStack o={opacity} animation={"lazy"}>
            {/* <Spinner o={0.5} color="$color10" size='large' scale={3} /> */}
            <Radio strokeWidth={1.4} size={100} />
        </XStack>
        <H2 o={0.3} fontSize={20} mt={10} fontWeight={"400"}>Waiting for messages</H2>
    </Tinted>
}
export default {
    'admin/messages': {
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
                <YStack f={1}>

                    <XStack pt="$3" px="$7" mb="$5">
                        <XStack left={-12} top={9} f={1} ai="center">
                            <Paragraph>
                                <Text fontSize="$5" color="$color11">Messages [<Tinted><Text fontSize={"$5"} o={1} color="$color10">{filteredMessages.length}</Text></Tinted>]</Text>
                            </Paragraph>
                        </XStack>
                    </XStack>
                    {!filteredMessages.length && <Center top={-100}>
                        <EmptyMessage />
                    </Center>}
                    {filteredMessages.map((m, i) => {
                        const data = parseMessage(m.message)
                        return <XStack hoverStyle={{ bc: "$" + tint + "4" }} key={i} btw={!i ? 1 : 0} bbw={1} boc={"$color4"}>
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