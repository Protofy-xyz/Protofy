import { useEffect, useState } from 'react';
import { getActionsFromAutomations } from '../bundles/automations/context/getActionsFromAutomations';
import { getStatesFromProtoMemDB } from '../bundles/protomemdb/context/getStatesFromProtoMemDB';
import { useEventEffect } from '../bundles/events/hooks';

const readState = async (tag, setState) => {
    const states = await getStatesFromProtoMemDB(tag, true)
    setState(states)
}

const readActions = async (tag, setActions) => {
    const actions = await getActionsFromAutomations(tag)
    setActions(actions)
}

export const useAutopilotAgent = (agentName: string) => {
    const [state, setState] = useState()
    const [actions, setActions] = useState()
    const [userActions, setUserActions] = useState()

    useEffect(() => {
        readActions(agentName, setActions)
        readActions(agentName + '-user', setUserActions)
        readState(agentName, setState)
    }, [])

    useEventEffect((event) => {
        readState(agentName, setState)
    }, { path: 'states/' + agentName + '/#' })

    return [state, actions, userActions]
}