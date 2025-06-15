import { useEffect, useState } from 'react';
import { getActionsFromAutomations } from '@extensions/automations/coreContext/getActionsFromAutomations';
import { getStatesFromProtoMemDB } from '@extensions/protomemdb/coreContext/getStatesFromProtoMemDB';
import { useEventEffect } from '@extensions/events/hooks';
import { AutopilotCard, RulesCard } from '../components/dashboard';
import { ActionRunner } from '../components/ActionRunner';
import { BasicCard, CardValue, CenterCard } from '@extensions/services/widgets';
import { Tag } from '@tamagui/lucide-icons';
import { runAction } from './runAction';
import { Input } from '@my/ui';

const getStateWidgets = (state, actions, confTable={}, FallbackIcon=Tag) => {
    const widgets = []
    state = state?.states ?? {}
    for (const key in state) {
        let value = state[key].value
        //if value is not defined, it means that the state is a group of states
        if (!value) value = state[key]
        if (state[key].name == 'rules') {
            widgets.push({ key: state[key].name, content: <RulesCard actions={actions} value={value} /> })
        } else if (value && value.getDataArray) {
            value = value.getDataArray().map((state) => <Input mb="$2" className="no-drag" width="100%" value={Object.keys(state).reduce((total, current) => total + current + ': ' + state[current] + ' ', '')}></Input>)
            widgets.push({ key: state[key].name, content: <BasicCard title={state[key].name} id={key}>{value}</BasicCard> })
        } else {
            widgets.push({
                key: state[key].name, content: <CenterCard title={state[key].name} id={key}>
                    <CardValue
                        Icon={confTable[state[key].name]?.icon ?? FallbackIcon}
                        value={value}
                        {...(confTable[state[key].name]?.color ? { color: confTable[state[key].name].color } : {})}
                    /></CenterCard>
            })
        }

    }
    return widgets
}

const getActionWidgets = (actions, onRun, confTable={}) => {
    const widgets = []
    //actions is an ActionGroup object
    if (!actions) return []
    for (const action of actions.getActions()) {
        const actionData = action.getData(true)
        widgets.push({
            key: actionData.name, content: <CenterCard title={actionData.displayName} id={actionData.name}>
                <ActionRunner action={actionData} onRun={onRun} conf={confTable[actionData.name]} />
            </CenterCard>
        })
    }
    return widgets
}

const readState = async (tag, setState) => {
    const states = await getStatesFromProtoMemDB('states', 'boards', tag, true)
    setState(states)
}

const readActions = async (tag, setActions) => {
    const actions = await getActionsFromAutomations(tag)
    setActions(actions)
}

export const useAutopilotAgent = (agentName: string, confTable={}, FallbackIcon=Tag) => {
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
    }, { path: 'states/boards/' + agentName + '/#' })

    const widgets = [
        ...getStateWidgets(state, actions, confTable, FallbackIcon),
        ...getActionWidgets(actions, runAction, confTable),
        ...getActionWidgets(userActions, runAction, confTable)
    ]

    widgets.push({ key: 'autopilottest', content: <AutopilotCard state={state} actions={userActions} onRun={runAction} agentName={agentName} /> })

    return [widgets, state, actions, userActions]
}