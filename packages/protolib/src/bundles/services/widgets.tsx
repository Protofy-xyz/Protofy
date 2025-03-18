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
import Center from 'protolib/src/components/Center';
import React from 'react';

export const viewLib = `
const icon = ({ name, size, color = 'var(--color7)', style = '' }) => {
    return \`
        <div style="
            width: \${size}px;
            height: \${size}px;
            background-color: \${color};
            mask-image: url(/public/icons/\${name}.svg);
            -webkit-mask-image: url(/public/icons/\${name}.svg);
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-position: center;
            -webkit-mask-position: center;
            \${style}
        "></div>
    \`;
};

const card = ({ content, style = '' }) => {
    return \`
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            \${style}
        ">
            \${content}
        </div>
    \`;
};

const cardValue = ({ value, style = '' }) => {
    return \`
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: bold
            \${style}           
        ">
            \${value}
        </div>
    \`;
};`


const fetch = async (fn) => {
    const services = await API.get('/api/core/v1/services')
    fn(services)
}

export const ServiceMemoryUsageChart = ({ title, id }) => {
    const [servicesData, setServicesData] = useRemoteStateList(undefined, fetch, ServiceModel.getNotificationsTopic(), ServiceModel, true);
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF007F", "#7B00FF", "#00FF7F", "#FF4500", "#4682B4"]

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

export const CenterCard = ({ title, id, children, onPress = () => { }, ...props }) => {
    return (
        <DashboardCard title={title} id={id} {...props}>
            <YStack onPress={onPress} borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1} justifyContent='center' alignItems='center'>
                <YStack alignItems="center" justifyContent="center" f={1} width="100%">
                    {children}
                </YStack>
            </YStack>
        </DashboardCard>
    );
}

export const BasicCard = ({ title, id, children }) => {
    return (
        <DashboardCard title={title} id={id}>
            <YStack borderRadius={10} backgroundColor="$bgColor" padding={10} flex={1}>
                <YStack width="100%">
                    {children}
                </YStack>
            </YStack>
        </DashboardCard>
    );
}

export const getHTML = (html, data) => {
    try {
        const wrapper = new Function('data', `
            ${viewLib}
            ${html}
        `);
        return wrapper(data);
    } catch(e) {
        console.error(e);
        return '';
    }
}

export const CardValue = ({ Icon, value, html, color = "var(--color7)" }) => {
    return (
        <YStack alignItems='center' justifyContent='center'>
            {html?.length > 0 && <div style={{width: "100%", height: '100%'}} dangerouslySetInnerHTML={{ __html: getHTML(html, {icon: Icon, value: value, color: color}) }} />}
            {!html?.length && <>
                {typeof Icon === 'string' ? <div style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: color,
                    maskImage: `url(${Icon})`,
                    WebkitMaskImage: `url(${Icon})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                }} /> :
                    <Icon color={color} size={48} strokeWidth={1.75} />}
                <Text userSelect="none" mt={10} fontSize={48} fontWeight="bold" color="$primary">
                    {React.isValidElement(value) || typeof value === 'string' || typeof value == 'number' ? value : 'N/A'}
                </Text>
            </>}
        </YStack>
    );
}

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
        <CenterCard title={title} id={id}>
            <AsyncView atom={servicesData}>
                <CardValue Icon={LineChart} value={(totalMemory / (1024 * 1024)).toFixed(2)} />
            </AsyncView>
        </CenterCard>
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
        <CenterCard title={title} id={id}>
            <AsyncView atom={servicesData}>
                <CardValue Icon={Cpu} value={totalCPU.toFixed(2)} />
            </AsyncView>
        </CenterCard>
    );
};