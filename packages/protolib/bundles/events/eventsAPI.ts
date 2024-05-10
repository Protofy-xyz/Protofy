import { EventModel, EventType } from ".";
import { AutoAPI, handler } from '../../api'
import { getDB } from 'app/bundles/storageProviders'
import { getServiceToken } from "../../api/lib/serviceToken";
import { API } from "../../base";

const dbPaths = '../../data/databases/events_paths'
const dbFroms = '../../data/databases/events_froms'
const dbUsers = '../../data/databases/events_users'
const dbEvents = '../../data/databases/events'

const registerEventMeta = async (data) => {
    if(!await getDB(dbPaths).exists(data.path)) {
        await getDB(dbPaths).put(data.path, '1')
    }
    if(!await getDB(dbFroms).exists(data.from)) {
        await getDB(dbFroms).put(data.from, '1')
    }
    if(!await getDB(dbUsers).exists(data.user)) {
        await getDB(dbUsers).put(data.user, '1')
    }
}
const EventAPI = AutoAPI({
    modelName: 'events',
    modelType: EventModel,
    prefix: '/adminapi/v1/',
    dbName: 'events',
    disableEvents: true,
    requiresAdmin: ['*'],
    itemsPerPage: 50,
    onAfterCreate: async (data)=> {
        await registerEventMeta(data)
        return data
    },
    logLevel: "debug",
    dbOptions: {
        batch: true
    }
})

export const EventsAPI = async (app, context) => {
    EventAPI(app, context)
    //TODO: remove in favor of a filtered event list call
    app.get('/adminapi/v1/events/signaling/list', async (req, res) => {
        const { isError, data } = await API.get('/adminapi/v1/events?token=' + getServiceToken() + '&all=1'); // TODO: Change for event api call that search
        if (isError) {
            res.send("Error obtaining signaling events")
            return;
        }
        const events = data?.items;
        const signalingEventsData = events?.filter((event: EventType) => event.path === 'signaling'); // should be at endpoint for event model applying search filter (related with previous one "TODO")
        res.send(signalingEventsData)
    })

    app.get('/adminapi/v1/events/options/generate', handler(async (req: any, res: any, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbEvents)
        for await (const [key, data] of db.iterator()) {
            try {
                await registerEventMeta(JSON.parse(data))
            } catch(e) {
                console.error('Error generating event meta: ', data)
            }
        }
        res.send({result: 'ok'})
    }))

    app.get('/adminapi/v1/events/options/all', handler(async (req: any, res: any, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const paths = getDB(dbPaths)
        const froms = getDB(dbFroms)
        const user = getDB(dbUsers)
        const response = {paths: [], users: [], froms: []}
        for await (const [key] of paths.iterator()) {
            response.paths.push(key)
        }
        for await (const [key] of froms.iterator()) {
            response.froms.push(key)
        }
        for await (const [key] of user.iterator()) {
            response.users.push(key)
        }
        res.send(response)
    }))

}