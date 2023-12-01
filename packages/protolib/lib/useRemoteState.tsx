import { useEffect, useState } from 'react';
import { useSubscription } from 'mqtt-react-hooks';
import { API, usePendingEffect } from 'protolib';
import { PendingResult } from './createApiAtom';

export const useRemoteStateList = (items, url, topic, model) => {
    const [dataState, setDataState] = useState<PendingResult | undefined>(items);

    usePendingEffect((s) => API.get(url, s), setDataState, dataState)

    const { message } = useSubscription(topic);
    console.log('subscribed to topic: ', topic)
    useEffect(() => {
        if (message && message.message) {
            const mqttDataString = typeof message.message === 'string' ? message.message : JSON.stringify(message.message);
            const mqttData = JSON.parse(mqttDataString);
            const [,,action] = message.topic.split('/')
            // console.log('data: ', mqttData)
            // console.log('action: ', action)
            setDataState((prev) => {
                const currentData = prev.data || {};
                const items = currentData.items || [];
        
                switch (action) {
                    case 'create':
                        return {
                            ...prev,
                            data: { ...currentData, items: [mqttData, ...items] },
                        };
                    case 'delete':
                        const newItemsDelete = items.filter(item => model.load(item).getId() !== model.load(mqttData).getId());
                        return {
                            ...prev,
                            data: { ...currentData, items: newItemsDelete },
                        };
                    case 'update':
                        const newItemsUpdate = items.map(item => model.load(item).getId() === model.load(mqttData).getId() ? mqttData : item);
                        return {
                            ...prev,
                            data: { ...currentData, items: newItemsUpdate },
                        };
                    default:
                        return prev;
                }
            });
        }
    }, [message]);

    return [dataState, setDataState];
};
