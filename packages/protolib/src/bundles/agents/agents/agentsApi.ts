import { API } from "protobase";
import { AgentsModel } from ".";
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { getDB } from '@my/config/dist/storageProviders';
import { generateEvent } from "../../events/eventsLibrary";
import { getLogger } from 'protobase';
import { bifrost } from "../bifrost/bifrost";
import { getTransporter } from "../bifrost/transporters";

export const AgentsAutoAPI = AutoAPI({
    modelName: 'Agents',
    modelType: AgentsModel,
    prefix: '/adminapi/v1/',
    skipDatabaseIndexes: true,
    useDatabaseEnvironment: false,
    useEventEnvironment: false
})

const logger = getLogger()


export const AgentsAPI = (app, context) => {
    const agentsPath = '../../data/agents/'
    const { topicSub, topicPub, mqtts } = context;
    AgentsAutoAPI(app, context)
    // agents topics: agents/[agentName]/[endpoint], en caso de no tener endpoint: agents/[agentName]
    /* examples
        agents/patata/switch/relay/actions/status
        agents/patata/button/relay/actions/status
        ...
    */
    app.get('/adminapi/v1/agents/:agent/subsystems/:subsystem/actions/:action/:value', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
        const env = agentInfo.getEnvironment()
        const subsystem = agentInfo.getSubsystem(req.params.subsystem)
        if (!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in agent [${req.params.agent}]`)
            return
        }

        const action = subsystem.getAction(req.params.action)
        if (!action) {
            res.status(404).send(`Action [${req.params.action}] not found in Subsytem [${req.params.subsystem}] for agent [${req.params.agent}]`)
            return
        }

        topicPub(mqtts[env], action.getEndpoint(), req.params.value == "undefined" ? action.data.payload?.type == "json" ? JSON.stringify(action.getValue()) : action.getValue() : req.params.value)

        res.send({
            subsystem: req.params.subsystem,
            action: req.params.action,
            agent: req.params.agent,
            result: 'done'
        })
    }))

    app.get('/adminapi/v1/agents/:agent/subsystems/:subsystem/monitors/:monitor', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const { agent: agentName, subsystem: subsystemName, monitor: monitorName } = req.params
        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(agentName)), session)
        // const env = agentInfo.getEnvironment()
        if (!agentInfo.getSubsystem(subsystemName)) {
            res.status(404).send(`Subsytem [${subsystemName}] not found in agent [${agentName}]`)
            return
        }

        const monitor = agentInfo.getMonitor(subsystemName, monitorName)
        if (!monitor) {
            res.status(404).send(`Monitor [${req.params.monitor}] not found in Subsytem [${subsystemName}] for agent [${agentName}]`)
            return
        }

        // environment query param:  env=${env}&
        const urlLastAgentEvent = `/adminapi/v1/events?filter[from]=agents&filter[user]=${agentName}&filter[path]=${monitor.endpoint}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`
        const data = await API.get(urlLastAgentEvent)

        if (!data || !data.data || !data.data['items'] || !data.data['items'].length) {
            res.status(404).send({ value: null })
            return
        }
        res.send({ value: data.data['items'][0]?.payload?.message })
    }))

    app.post('/adminapi/v1/agents/:agent/subsystems/:subsystem/monitors/:monitor/ephemeral', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
        const env = agentInfo.getEnvironment()
        const subsystem = agentInfo.getSubsystem(req.params.subsystem)
        if (!subsystem) {
            res.status(404).send(`Subsytem [${req.params.subsystem}] not found in agent [${req.params.agent}]`)
            return
        }

        const monitor = subsystem.getMonitor(req.params.monitor)
        if (!monitor) {
            res.status(404).send(`Monitor [${req.params.monitor}] not found in Subsytem [${req.params.subsystem}] for agent [${req.params.agent}]`)
            return
        }
        let { value } = req.body
        if (value == "true" || value == true) {
            value = true;
        } else {
            value = false;
        }
        const agent = agentInfo.setMonitorEphemeral(req.params.subsystem, req.params.monitor, value)
        if (agent) {
            await db.put(agent.getId(), JSON.stringify(agent.serialize(true)))
        }
        res.send({ value })
    }))

    // agents protocol
    switch (getTransporter()) {
        case "mqtt":
            topicSub(mqtts['dev'], 'agents/#', (message, topic) => bifrost('dev', context, message, topic))
            topicSub(mqtts['prod'], 'agents/#', (message, topic) => bifrost('prod', context, message, topic))
            break
        default:
            topicSub(mqtts['dev'], 'agents/#', (message, topic) => bifrost('dev', context, message, topic))
            topicSub(mqtts['prod'], 'agents/#', (message, topic) => bifrost('prod', context, message, topic))
            break
    }
}