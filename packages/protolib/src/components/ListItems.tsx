import React from 'react';
import { YStack, Text, XStack } from '@my/ui';
import { useRemoteStateList } from '../lib/useRemoteState';
import AsyncView from './AsyncView';
import { DashboardCard } from './DashboardCard';
import { Tinted } from './Tinted';
import { API } from 'protobase';

interface ListItemsProps {
    title: string;
    id: string;
    fetchFunc: ((fn: Function) => void) | string;
    model: any;
    displayFields: Array<{ label: string; field: string }>;
    itemComponent?: React.FC<{ item: any }>;
    limit?: number;
}

export const ListItems: React.FC<ListItemsProps> = ({ title, id, fetchFunc, model, displayFields, itemComponent: ItemComponent, limit }) => {
    const defaultFetchFunc = async (fn: Function) => {
        if (typeof fetchFunc === 'string') {
            const response = await API.get(fetchFunc);
            fn(response);
        }
    };

    const finalFetchFunc = typeof fetchFunc === 'function' ? fetchFunc : defaultFetchFunc;

    const [data, setData] = useRemoteStateList(undefined, finalFetchFunc, model.getNotificationsTopic(), model, true);

    // RegExp to detect ISO date strings
    const isoDateRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1}>
                <AsyncView atom={data}>
                    {data?.data?.items && (
                        <YStack space={10}>
                            {data.data.items.slice(0, limit ?? data.data.items.length).map(item => (
                                <XStack key={item.id} space={5} f={1}>
                                    {ItemComponent ? (
                                        <ItemComponent item={item} />
                                    ) : (
                                        <Tinted>
                                            <Text fontWeight="bold" fontSize={18} color="$primary">
                                                {item.name}
                                            </Text>
                                        </Tinted>
                                    )}
                                    <XStack space={15} alignItems="center" justifyContent="space-between">
                                        {displayFields.map(({ label, field }) => (
                                            <XStack key={field}>
                                                <Text fontWeight="600" color="$color9">{label}:</Text>
                                                <Text ml="$2">
                                                    {isoDateRegExp.test(item[field])
                                                        ? formatDate(item[field])
                                                        : item[field]}
                                                </Text>
                                            </XStack>
                                        ))}
                                    </XStack>
                                </XStack>
                            ))}
                        </YStack>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};