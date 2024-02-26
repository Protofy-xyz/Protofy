import { useEffect, useState } from 'react';
import { useSubscription } from 'mqtt-react-hooks';
import { API, usePendingEffect } from 'protolib';
import { PendingResult } from '../base';

const disableRealTimeDiff = true //toggle to false to activate realtime updates without refetch

export const useRemoteStateList = (items, fetch, topic, model) => {
    const [dataState, setDataState] = useState<PendingResult | undefined>(items);

    usePendingEffect((s) => fetch(s), setDataState, dataState)

    const { message } = useSubscription(topic);
    console.log('subscribed to topic for changes: ', topic)
    useEffect(() => {
        if (message && message.message) {
            const mqttDataString = typeof message.message === 'string' ? message.message : JSON.stringify(message.message);
            const mqttData = JSON.parse(mqttDataString);
            const [,,action] = message.topic.split('/')
            // console.log('data: ', mqttData)
            // console.log('action: ', action)
            if(!disableRealTimeDiff) {
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

            fetch(setDataState)
        }
    }, [message]);

    return [dataState, setDataState];
};
