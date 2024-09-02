import React from 'react';
import { YStack } from '@my/ui';
import { useRemoteStateList } from '../lib/useRemoteState';
import AsyncView from './AsyncView';
import { DashboardCard } from './DashboardCard';
import { SimpleDataTable } from './SimpleDataTable';
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

    const columns = displayFields.map(({ label, field }) => ({
        name: label,
        selector: (row) => {
            const value = row[field];
            return isoDateRegExp.test(value) ? formatDate(value) : value;
        }
    }));

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" paddingHorizontal={10} flex={1}>
                <AsyncView atom={data}>
                    {data?.data?.items && (
                        <SimpleDataTable columns={columns} data={data.data.items.slice(0, limit ?? data.data.items.length)} />
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};
