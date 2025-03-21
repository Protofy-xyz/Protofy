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
            height: 100%;
            width: 100%;
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
const cardAction = ({ data }) => {
    const margin = 10;
    const keys = Object.keys(data.params || {});
    const longestKey = keys.reduce((acc, cur) => (
        cur.length > acc.length ? cur : acc
    ), '');
    const baseLabelWidth = longestKey.length * 8 + margin;

    return \`
    <div style="
        flex:1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    ">

        <form 
            style="display: flex; justify-content: space-between; flex-direction: column; flex: 1; width: 100%" 
            onsubmit='window.executeAction(event, \${JSON.stringify(data).replace(/'/g, \"\\\\'\")})'
        >
            <div style="gap: 10px; display:  \${keys.length > 0 ? 'flex' : 'none'}; flex-direction: column; flex: 1; width: 100%; margin-top: 8px; margin-bottom: 20px;">
                \${ 
                    keys.length > 0 
                    ? keys.map(key => \`
                        <div style="
                            display: flex; 
                            width: 100%; 
                            margin-bottom: 5px;
                            box-sizing: border-box;
                            flex-direction: column;
                            gap: 5px;
                        ">
                            <label style="
                                display: inline-block; 
                                font-weight: 300;
                                width: clamp(120px, \${baseLabelWidth}px, 200px);
                                margin-left: 10px;
                                text-align: left;
                                white-space: nowrap;
                                overflow: hidden;
                                opacity: 0.7;
                                text-overflow: ellipsis;
                            ">
                                \${key}
                            </label>
                            <input 
                                class="no-drag" 
                                type="text" 
                                name="\${key}" 
                                style="
                                    background-color: var(--gray1);
                                    flex: 1;
                                    width: 100%;
                                    padding: 5px 10px; 
                                    border: 0.5px solid #ccc; 
                                    border-radius: 8px;
                                    box-sizing: border-box;
                                    min-width: 100px;
                                " 
                                placeholder="\${data.params[key]}"
                            >
                        </div>
                    \`).join('') 
                    : ''
                }
            </div>
            <button 
                class="no-drag" 
                type="submit" 
                style="
                    width: 100%; 
                    padding: 10px; 
                    max-height: 200px;
                    margin-top: 10px; 
                    display: flex;
                    background-color: \${data.color};
                    align-items: center;
                    justify-content: center;
                    color: white; 
                    border: none; 
                    border-radius: 8px;
                    flex: 1;
                    cursor: pointer;
                    transition: filter 0.2s ease-in-out;
                "
                onmouseover="this.style.filter='brightness(1.05)'"
                onmouseout="this.style.filter='none'"
                onmousedown="this.style.filter='saturate(1.2) contrast(1.2) brightness(0.85)'"
                onmouseup="this.style.filter='brightness(1.05)'"
            >
                \${icon({ name: data.icon, color: data.color, size: '48', style: 'filter: brightness(0.7);' })}    
            </button>
            <textarea 
                id="\${data.name+'_response'}" 
                readonly 
                placeholder="Responses will appear here..." 
                style="
                    display: \${data.displayResponse ? 'block' : 'none'};
                    padding: 10px;
                    resize: none; 
                    height: 100%; 
                    flex: 1; 
                    margin-bottom: 0px; 
                    margin-top: 20px;
                    width: 100%;
                    border: 0.5px solid var(--gray7);
                    border-radius: 8px;
                    box-sizing: border-box;
                    background-color: var(--gray1);
                " 
                class="no-drag"
            ></textarea>
        </form>
    </div>
    \`;
};




const cardValue = ({ value, style = '' }) => {
    return \`
        <div style="
            width: 100%;
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
    } catch (e) {
        console.error(e);
        return '';
    }
}

export const CardValue = ({ Icon, value, html, color = "var(--color7)" }) => {
    return (
        <YStack alignItems='center' justifyContent='center'>
            {html?.length > 0 && <div style={{ width: "100%", height: '100%' }} dangerouslySetInnerHTML={{ __html: getHTML(html, { icon: Icon, value: value, color: color }) }} />}
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