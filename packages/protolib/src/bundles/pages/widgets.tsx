import { YStack, Text, XStack, Card, Separator } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase'
import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { useRemoteStateList } from 'protolib/src/lib/useRemoteState';
import { PageModel } from './pagesSchemas';
import AsyncView from '../../components/AsyncView';
import Center from '../../components/Center';
import { DashboardCard } from '../../components/DashboardCard';
import Link from 'next/link'
import { User2, Cpu, Link as LinkIcon} from 'lucide-react'
import { Tinted } from '../../components/Tinted';

const fetch = async (fn) => {
    const users = await API.get('/adminapi/v1/pages')
    fn(users)
}

export const ListPages = ({ title, id }) => {
    const [pagesData, setPagesData] = useRemoteStateList(undefined, fetch, PageModel.getNotificationsTopic(), PageModel, true);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1}>

                <AsyncView atom={pagesData}>
                    {pagesData?.data?.items && (
                        <YStack space={10}>
                            {pagesData.data.items.map(page => (
                                <XStack space={5} f={1}>
                                    <Tinted>
                                        <Text fontWeight="bold" fontSize={18} color="$primary">
                                            {page.name}
                                        </Text>
                                    </Tinted>

                                    <XStack space={15} alignItems="center" justifyContent="space-between">
                                        <XStack>
                                            <Text ml="$2">{page.route}</Text>
                                        </XStack>
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