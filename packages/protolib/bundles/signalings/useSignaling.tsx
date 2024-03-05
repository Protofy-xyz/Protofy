import { useEffect, useState } from 'react';
import { useSubscription } from 'mqtt-react-hooks';
import { API } from '../../base/Api';

export const useSignaling = (clientIds: string[]) => {
    // This hook returns the connectivity states for the provided array of clientIds
    let firstLoad = true;
    const [connectivityStates, setConnectivityStates] = useState({})
    const { message: signalingMessage } = useSubscription('signaling/create'); // when signal is created send info in that topic

    const getConnectivityStatus = async () => {
        const { data, isError } = await API.post("/adminapi/v1/signalings/clients/status", { clientIds })
        if (isError) return
        setConnectivityStates(data)
    }

    useEffect(() => { // signaling check for mqtt signaling changes and retrigger retrival of connectivity states
        if (firstLoad) { // Make sure gets connectivity status for the first time
            getConnectivityStatus()
            firstLoad = false
        }
        if (signalingMessage?.message) {
            getConnectivityStatus()
        }
    }, [signalingMessage])

    return connectivityStates
}