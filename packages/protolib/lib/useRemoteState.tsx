import { useEffect, useRef, useState } from 'react';
import { API, usePendingEffect, useSubscription } from 'protolib';
import { PendingResult } from '../base';

export const useRemoteStateList = (items, fetch, topic, model, quickRefresh=false) => { // Quick refresh skips fetch when a change is detected
    const [dataState, setDataState] = useState<PendingResult | undefined>(items);
    const lastId = useRef(0)
    usePendingEffect((s) => fetch(s), setDataState, dataState)

    const { messages } = useSubscription(topic);
    // console.log('subscribed to topic for changes: ', topic)
    useEffect(() => {
        const unseenMessages = messages.filter(m => m.id > lastId.current)
        if(unseenMessages.length > 0) {
            if(quickRefresh) {
                unseenMessages.forEach(message => {
                    const mqttDataString = typeof message.message === 'string' ? message.message : JSON.stringify(message.message);
                    const mqttData = JSON.parse(mqttDataString);
                    const [,,action] = message.topic.split('/')
                    // console.log('data: ', mqttData)
                    // console.log('action: ', action)
                    setDataState((prev) => {
                        const currentData = prev?.data || {};
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
                    lastId.current = message.id
                })
            } else {
                lastId.current = unseenMessages[unseenMessages.length-1].id
                fetch(setDataState)
            }
        }
    }, [messages]);

    return [dataState, setDataState];
};
