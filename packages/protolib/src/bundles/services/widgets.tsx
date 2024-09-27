import { YStack, Text, XStack } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase'
import { useState, useEffect } from 'react';
import { useRemoteStateList } from '../../lib/useRemoteState';
import { ServiceModel } from './servicesSchema';
import AsyncView from '../../components/AsyncView';
import { DashboardCard } from '../../components/DashboardCard';
import { PieChart } from '../../components/PieChart';

import { LineChart, Cpu } from 'lucide-react'

const fetch = async (fn) => {
    const services = await API.get('/adminapi/v1/services')
    console.log("services", services)
    fn(services)
}

export const ServiceMemoryUsageChart = ({ title, id }) => {
    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true);
    const COLORS = [ "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF007F", "#7B00FF", "#00FF7F", "#FF4500", "#4682B4" ]
      
    if (!servicesData?.data?.items) return null;

    return (
        <PieChart
            title={title}
            id={id}
            data={servicesData.data.items}
            dataKey="memory"
            nameKey="name"
            colors={COLORS}
            tooltipFormatter={(value) => `${(value / (1024 * 1024)).toFixed(2)} MB`}
            isAnimationActive={false}
        />
    );
};

export const TotalMemoryUsage = ({ title, id }) => {
    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true);
    const [totalMemory, setTotalMemory] = useState(0);

    useEffect(() => {
        if (servicesData?.data?.items) {
            const total = servicesData.data.items.reduce((sum, service) => sum + service.memory, 0);
            setTotalMemory(total);
        }
    }, [servicesData]);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                <AsyncView atom={servicesData}>
                    {servicesData?.data?.items && (
                        <YStack alignItems="center" justifyContent="center">
                            <LineChart color="var(--color7)" size={48} strokeWidth={1.75} />
                            <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                                {(totalMemory / (1024 * 1024)).toFixed(2)} MB
                            </Text>
                        </YStack>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};


export const TotalCPUUsage = ({ title, id }) => {
    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true);
    const [totalCPU, setTotalCPU] = useState(0);

    useEffect(() => {
        if (servicesData?.data?.items) {
            const total = servicesData.data.items.reduce((sum, service) => sum + service.cpu, 0);
            setTotalCPU(total);
        }
    }, [servicesData]);

    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                <AsyncView atom={servicesData}>
                    {servicesData?.data?.items && (
                        <YStack alignItems="center" justifyContent="center">
                            <Cpu color="var(--color7)" size={48} strokeWidth={1.75} />
                            <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                                {totalCPU.toFixed(2)} %
                            </Text>
                        </YStack>
                    )}
                </AsyncView>
            </YStack>
        </DashboardCard>
    );
};