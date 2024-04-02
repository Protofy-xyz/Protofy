import { EventModel, EventType } from ".";
import { AutoAPI } from '../../api'
import { getServiceToken } from "../../api/lib/serviceToken";
import { API } from "../../base";

const EventAPI = AutoAPI({
    modelName: 'events',
    modelType: EventModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    dbName: 'events',
    disableEvents: true,
    requiresAdmin: ['*'],
    logLevel: "debug",
    itemsPerPage: 100
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
}