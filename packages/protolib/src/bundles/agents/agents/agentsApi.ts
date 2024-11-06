import { API } from "protobase";
import { AgentsModel } from ".";
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { getDB } from '@my/config/dist/storageProviders';
import { generateEvent } from "../../events/eventsLibrary";
import { getLogger } from 'protobase';
import { BifrostProtocol } from "../bifrost/bifrost";

export const AgentsAutoAPI = AutoAPI({
    modelName: 'agents',
    modelType: AgentsModel,
    prefix: '/api/core/v1/',
    skipDatabaseIndexes: true
})

const logger = getLogger()


export const AgentsAPI = (app, context) => {
    const agentsPath = '../../data/agents/'
    const { topicSub, topicPub, mqtt } = context;
    AgentsAutoAPI(app, context)
    // agents topics: agents/[agentName]/[endpoint], en caso de no tener endpoint: agents/[agentName]
    /* examples
        agents/patata/switch/relay/actions/status
        agents/patata/button/relay/actions/status
        ...
    */
    app.get('/api/core/v1/agents/:agent/subsystems/:subsystem/actions/:action/:value', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
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

        topicPub(mqtt, action.getEndpoint(), req.params.value == "undefined" ? action.data.payload?.type == "json" ? JSON.stringify(action.getValue()) : action.getValue() : req.params.value)

        res.send({
            subsystem: req.params.subsystem,
            action: req.params.action,
            agent: req.params.agent,
            result: 'done'
        })
    }))

    app.get('/api/core/v1/agents/:agent/subsystems/:subsystem/monitors/:monitor', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const { agent: agentName, subsystem: subsystemName, monitor: monitorName } = req.params
        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(agentName)), session)

        if (!agentInfo.getSubsystem(subsystemName)) {
            res.status(404).send(`Subsytem [${subsystemName}] not found in agent [${agentName}]`)
            return
        }

        const monitor = agentInfo.getMonitor(subsystemName, monitorName)
        if (!monitor) {
            res.status(404).send(`Monitor [${req.params.monitor}] not found in Subsytem [${subsystemName}] for agent [${agentName}]`)
            return
        }

        const urlLastAgentEvent = `/api/core/v1/events?filter[from]=agents&filter[user]=${agentName}&filter[path]=${monitor.endpoint}&itemsPerPage=1&token=${session.token}&orderBy=created&orderDirection=desc`
        const data = await API.get(urlLastAgentEvent)

        if (!data || !data.data || !data.data['items'] || !data.data['items'].length) {
            res.status(404).send({ value: null })
            return
        }
        res.send({ value: data.data['items'][0]?.payload?.message })
    }))

    app.post('/api/core/v1/agents/:agent/subsystems/:subsystem/monitors/:monitor/ephemeral', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)
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

    app.get('/api/core/v1/agents/:agent/status', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB('agents')
        const agentInfo = AgentsModel.load(JSON.parse(await db.get(req.params.agent)), session)

        // await db.put(agent.getId(), JSON.stringify(agent.serialize(true)))
        res.send({ status: agentInfo.data.status })
    }))

    // agents protocol
    BifrostProtocol({ ...context, logger })
}