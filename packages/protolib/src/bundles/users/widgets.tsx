import { YStack, Text, XStack } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase'
import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { useRemoteStateList } from 'protolib/src/lib/useRemoteState';
import { UserModel } from './usersSchemas';
import AsyncView from '../../components/AsyncView';
import Center from '../../components/Center';
import { DashboardCard } from '../../components/DashboardCard';
import Link from 'next/link'
import { User2, Cpu } from 'lucide-react'

const fetch = async (fn) => {
    const users = await API.get('/adminapi/v1/accounts')
    fn(users)
}


export const TotalUsers = ({ title, id }) => {
    const [usersData, setusersData] = useRemoteStateList(undefined, fetch, UserModel.getNotificationsTopic(), UserModel, true);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        if (usersData?.data?.items) {
            const total = usersData.data.total
            setTotalUsers(total);
        }
    }, [usersData]);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                <AsyncView atom={usersData}>
                    {usersData?.data?.items && (
                        <Link href="./users" className="no-drag">
                            <YStack alignItems="center" justifyContent="center">
                                <User2 color="var(--color7)" size={48} strokeWidth={1.75} />
                                <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                                    {totalUsers}
                                </Text>
                            </YStack>
                        </Link>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};