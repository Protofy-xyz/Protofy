import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase'
import { useRemoteStateList } from 'protolib/src/lib/useRemoteState';
import { EventModel } from './eventsSchemas';
import AsyncView from '../../components/AsyncView';
import { DashboardCard } from '../../components/DashboardCard';
import { YStack, XStack, Text, Card } from '@my/ui';


export const LastEvents = ({ title, id }) => {
    const fetch = async (fn) => {
        const events = await API.get('/adminapi/v1/events');
        fn(events);
    };

    const [eventsData, setEventsData] = useRemoteStateList(undefined, fetch, EventModel.getNotificationsTopic(), EventModel, true);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center'>
                <AsyncView atom={eventsData}>
                    {eventsData?.data?.items && (
                        <YStack space={10}>
                            {eventsData.data.items.slice(0, 5).map(event => (
                                <Card key={event.id} borderRadius={10} padding={15} backgroundColor="$bgHover" shadow="md">
                                    <YStack space={5}>
                                        <Text fontWeight="bold" fontSize={18} color="$primary">
                                            {event.path}
                                        </Text>

                                        <XStack space={15} alignItems="center" justifyContent="space-between">
                                            <XStack>
                                                <Text fontWeight="600" color="$color9">From:</Text>
                                                <Text ml="$2">{event.from}</Text>
                                            </XStack>
                                            <XStack>
                                                <Text fontWeight="600" color="$color9">User:</Text>
                                                <Text ml="$2">{event.user}</Text>
                                            </XStack>
                                            <XStack>
                                                <Text fontWeight="600" color="$color9">Date:</Text>
                                                <Text ml="$2">{new Date(event.created).toLocaleString()}</Text>
                                            </XStack>
                                        </XStack>
                                    </YStack>
                                </Card>
                            ))}
                        </YStack>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};