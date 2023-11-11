import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useSubscription } from 'mqtt-react-hooks';
import { createApiAtom, API, usePendingEffect } from 'protolib';

const useRemoteState = (items, url, topic) => {
    const dataAtom = createApiAtom(null);
    const [dataState, setDataState] = useAtom(dataAtom);

    usePendingEffect((s) => API.get(url, s), setDataState, items)

    const { message } = useSubscription(topic);
    useEffect(() => {
        if (message && message.message) {
            const mqttDataString = typeof message.message === 'string' ? message.message : JSON.stringify(message.message);
            const mqttData = JSON.parse(mqttDataString);
            setDataState((prev) => {
                const currentData = prev.data || {};
                const items = currentData.items || [];
        
                switch (mqttData.type) {
                    case 'add':
                        return {
                            ...prev,
                            data: { ...currentData, items: [...items, mqttData.data] },
                        };
                    case 'delete':
                        const newItemsDelete = items.filter(item => item.id !== mqttData.data.id);
                        return {
                            ...prev,
                            data: { ...currentData, items: newItemsDelete },
                        };
                    case 'update':
                        const newItemsUpdate = items.map(item => item.id === mqttData.data.id ? mqttData.data : item);
                        return {
                            ...prev,
                            data: { ...currentData, items: newItemsUpdate },
                        };
                    default:
                        return prev;
                }
            });
        }
    }, [message, setDataState]);

    return [dataState, setDataState];
};
