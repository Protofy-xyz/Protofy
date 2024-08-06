import { YStack, Text, XStack } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase'
import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { useRemoteStateList } from 'protolib/src/lib/useRemoteState';
import { ServiceModel } from './servicesSchema';
import AsyncView from '../../components/AsyncView';
import Center from '../../components/Center';

import { LineChart, Cpu } from 'lucide-react'



export const ServiceMemoryUsageChart = () => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
    const fetch = async (fn) => {
        const services = await API.get('/adminapi/v1/services')
        console.log("services", services)
        fn(services)
    }
    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true)

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
            <AsyncView atom={servicesData}>
                {servicesData?.data?.items && <PieChart width={450} height={400}>
                    <Pie
                        data={servicesData.data.items}
                        dataKey="memory"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label={renderCustomizedLabel}
                        labelLine={false}
                        isAnimationActive={false}
                    >
                        {servicesData.data.items.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Center><Tooltip formatter={(value) => `${(value / (1024 * 1024)).toFixed(2)} MB`} /></Center>
                    <Legend />
                </PieChart>}
            </AsyncView>
        </YStack>
    );
};



export const TotalMemoryUsage = () => {
    const fetch = async (fn) => {
        const services = await API.get('/adminapi/v1/services');
        console.log("services", services);
        fn(services);
    };

    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true);
    const [totalMemory, setTotalMemory] = useState(0);

    useEffect(() => {
        if (servicesData?.data?.items) {
            const total = servicesData.data.items.reduce((sum, service) => sum + service.memory, 0);
            setTotalMemory(total);
        }
    }, [servicesData]);

    return (
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
    );
};


export const TotalCPUUsage = () => {
    const fetch = async (fn) => {
        const services = await API.get('/adminapi/v1/services');
        console.log("services", services);
        fn(services);
    };

    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true);
    const [totalCPU, setTotalCPU] = useState(0);

    useEffect(() => {
        if (servicesData?.data?.items) {
            const total = servicesData.data.items.reduce((sum, service) => sum + service.cpu, 0);
            setTotalCPU(total);
        }
    }, [servicesData]);

    return (
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
    );
};