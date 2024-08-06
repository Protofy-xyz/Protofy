import { YStack, Text } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { API } from 'protobase'
import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { useRemoteStateList } from 'protolib/src/lib/useRemoteState';
import { ServiceModel } from './servicesSchema';
import AsyncView from '../../components/AsyncView';

export const ServiceMemoryUsageChart = () => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
    const fetch = async (fn) => {
        const services = await API.get('/adminapi/v1/services')
        console.log("services", services)
        fn(services)
    }
    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true)
    console.log("servicesData", servicesData)
    return (
        <YStack borderRadius={10} backgroundColor="$bgPanel" padding={10}>
            <Text style={{ textAlign: "center", marginBottom: 10 }}>Memory Usage</Text>
            <AsyncView atom={servicesData}>
                {servicesData?.data?.items && <PieChart width={600} height={500}>
                    <Pie
                        data={servicesData.data.items}
                        dataKey="memory"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                    >
                        {servicesData.data.items.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${(value / (1024 * 1024)).toFixed(2)} MB`} />
                    <Legend />
                </PieChart>}
            </AsyncView>
        </YStack>
    );
};
