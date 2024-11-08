import { API } from "protobase";
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { getLogger } from 'protobase';
import { BifrostProtocol } from "../bifrost/bifrost";

const logger = getLogger()


export const network = (app, context) => {
    const agentsPath = '../../data/agents/'
    const { topicSub, topicPub, mqtt } = context;

    app.get('/api/core/v1/network', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        res.send("protofy network")
    }))

    // agents protocol
    BifrostProtocol({ ...context, logger })
}