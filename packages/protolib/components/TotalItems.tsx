import { YStack, Text } from '@my/ui';
import { useState, useEffect } from 'react';
import AsyncView from './AsyncView';
import { DashboardCard } from './DashboardCard';
import Link from 'next/link';
import { useRemoteStateList } from '../lib/useRemoteState';
import { API } from 'protobase';

interface TotalItemsProps {
    title: string;
    id: string;
    fetchFunc?: ((fn: Function) => void) | string;
    model: any;
    icon: any;
    link: string;
    color?: string; 
}

export const TotalItems: React.FC<TotalItemsProps> = ({ title, id, fetchFunc, model, icon: Icon, link, color }) => {
    const defaultFetchFunc = async (fn: Function) => {
        if (typeof fetchFunc === 'string') {
            const response = await API.get(fetchFunc);
            fn(response);
        }
    };

    const finalFetchFunc = typeof fetchFunc === 'function' ? fetchFunc : defaultFetchFunc;

    const [data, setData] = useRemoteStateList(undefined, finalFetchFunc, model.getNotificationsTopic(), model, true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (data?.data?.items) {
            const totalCount = data.data.total;
            setTotal(totalCount);
        }
    }, [data]);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                <AsyncView atom={data}>
                    {data?.data?.items && (
                        <Link href={link} className="no-drag">
                            <YStack alignItems="center" justifyContent="center">
                                <Icon color={color || "var(--color7)"} size={48} strokeWidth={1.75} />
                                <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                                    {total}
                                </Text>
                            </YStack>
                        </Link>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};
export default TotalItems;