import { Protofy, API } from 'protobase'
import { SSR } from 'protolib/lib/SSR';
import { AdminPage } from 'protolib/components/AdminPage'
import { DashboardGrid } from 'protolib/components/DashboardGrid';
import { withSession } from 'protolib/lib/Session';
import { Button, Input, Paragraph, XStack, YStack, Tooltip } from '@my/ui';
import { CenterCard, CardValue } from 'protolib/bundles/widgets';
import BubbleChat from 'protolib/components/BubbleChat';
import { Tinted } from 'protolib/components/Tinted';
import { DefaultLayout } from '../layout/DefaultLayout'
import { useEffect } from 'react';
import React from 'react';
import { Car, Gauge, SatelliteDish, Tag } from '@tamagui/lucide-icons';
import { useEventEffect } from 'protolib/bundles/events/hooks';
import { getActionsFromAutomations } from 'protolib/bundles/automations/context/getActionsFromAutomations';
import { getStatesFromProtoMemDB } from 'protolib/bundles/protomemdb/context/getStatesFromProtoMemDB';

const isProtected = Protofy("protected", false)

Protofy("pageType", "admin")

const readState = async (tag, setState) => {
    const states = await getStatesFromProtoMemDB(tag, true)
    setState(states)
}

const readActions = async (tag, setActions) => {
    const actions = await getActionsFromAutomations(tag)
    setActions(actions)
}

const FallbackIcon = Tag
const IconTable = {
    "status": Car,
    "front_distance_sensor": SatelliteDish,
    "speed": Gauge
}

const ActionRunner = ({ action, onRun }) => {
    const [params, setParams] = React.useState({})
    return <XStack f={1} width="100%">
        <YStack f={1} alignItems="center" justifyContent="center">
            {Object.keys(action.automationParams).map((key) => {
                return <Tooltip>
                    <Tooltip.Trigger width={"100%"}>
                        <XStack width="100%" alignItems="center">
                            <Paragraph flex={1} mr={"$5"}>{key}</Paragraph>
                            <Input onChangeText={(text) => setParams({
                                ...params,
                                [key]: text
                            })} flex={2} placeholder="Value" className="no-drag" />
                        </XStack>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <Tooltip.Arrow />
                        <Paragraph>{action.automationParams[key]}</Paragraph>
                    </Tooltip.Content>
                </Tooltip>
            })}
            <Tooltip>
                <Tooltip.Trigger width={"100%"}>
                    <Button mt={"$3"} width="100%" className="no-drag" onPress={() => {
                        //actionData.automationParams is a key value object where the key is the name of the parameter and the value is the description
                        //if there are parameters, they should be included in the query parameters of the request
                        //if a parameter is missing, remove it from the query parameters
                        const cleanedParams = {}
                        for (const key in params) {
                            if (params[key] || params[key] === "0") {
                                cleanedParams[key] = params[key]
                            }
                        }
                        onRun(action, cleanedParams)
                    }}>Run</Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <Tooltip.Arrow />
                    <Paragraph>{action.description}</Paragraph>
                </Tooltip.Content>
            </Tooltip>
        </YStack>
    </XStack>
}

const getStateWidgets = (state) => {
    const widgets = []
    state = state?.states ?? {}
    for (const key in state) {
        widgets.push({ key: key, content: <CenterCard title={state[key].name} id={key}><CardValue Icon={IconTable[state[key].name] ?? FallbackIcon} value={state[key].value} /></CenterCard> })
    }
    return widgets
}

const getActionWidgets = (actions, onRun) => {
    const widgets = []
    //actions is an ActionGroup object
    if (!actions) return []
    for (const action of actions.getActions()) {
        const actionData = action.getData(true)
        widgets.push({
            key: actionData.name, content: <CenterCard title={actionData.displayName} id={actionData.name}>
                <ActionRunner action={actionData} onRun={onRun} />
            </CenterCard>
        })
    }
    return widgets
}

const getLayouts = (items) => {
    return {
        "lg": items.map((widget, index) => ({
            "i": widget.key,
            "x": (index % 4) * 3, // Ajusta a 4 columnas en lugar de 12
            "y": Math.floor(index / 4) * 6, // Mueve cada 4 elementos en vez de 12
            "w": 3,
            "h": 6,
            "isResizable": true
        })),
        "md": items.map((widget, index) => ({
            "i": widget.key,
            // index % 2 alterna entre 0 y 1, con lo que vas colocando widgets en 2 columnas.
            "x": (index % 2) * 5,
            "y": Math.floor(index / 2) * 6,
            "w": 5, // cada widget ocupa 5 columnas de ancho
            "h": 6,
            "isResizable": true
        })),
        "sm": items.map((widget, index) => ({
            "i": widget.key,
            "x": 0, // Todos en una sola columna
            "y": index * 7, // Espaciado vertical mayor
            "w": 12,
            "h": 7,
            "isResizable": true
        }))
    }
}

const agentName = "{{agentName}}"

const AgentPanel = ({ agentName }) => {
    const [state, setState] = React.useState()
    const [actions, setActions] = React.useState()
    const [userActions, setUserActions] = React.useState()

    useEffect(() => {
        readActions(agentName, setActions)
        readActions(agentName + '-user', setUserActions)
        readState(agentName, setState)
    }, [])

    useEventEffect((event) => {
        readState(agentName, setState)
    }, { path: 'states/' + agentName + '/#' })

    //executed when an action is run in the frontend
    const onRun = (action, params) => {
        console.log('Running action: ', action, 'with params: ', params)
        API.get(`/api/v1/automations/${action.name}` + (Object.keys(params).length > 0 ? "?" + Object.keys(params).map((key) => key + "=" + params[key]).join("&") : ""))
    }

    const widgets = [
        ...getStateWidgets(state),
        ...getActionWidgets(actions, onRun),
        ...getActionWidgets(userActions, onRun)
    ]

    const layouts = getLayouts(widgets)

    return <YStack flex={1} padding={20}>
        <DashboardGrid items={widgets} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white" />
    </YStack>
}

export default {
    route: Protofy("route", "{{route}}"),
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
        return (<AdminPage title="{{name}}" pageSession={pageSession}>
                <XStack flex={1} overflow="scroll">
                    <AgentPanel agentName={agentName} />
                </XStack>
        </AdminPage>)
    },
    getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}