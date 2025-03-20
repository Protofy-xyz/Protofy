import { API } from "protobase";
import { getServiceToken } from "./serviceToken";
export const AutoActions = ({
    modelName,
    modelType,
    prefix = "/api/v1/"
}) => async (app, context) => {
    const urlPrefix = `${prefix}${modelName}`;
    const actionUrlPrefix = `${prefix}actions/${modelName}`;

    app.get(actionUrlPrefix+'/exists', async (req, res) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}`);
            if(result.isLoaded) {
                return res.json(true);
            }
            return res.json(false);
        } catch(e) {
            return res.status(500).json(false);
        }
    });

    context.actions.add({
        group: 'objects',
        name: 'exists', //get last path element
        url: actionUrlPrefix+'/exists',
        tag: modelName,
        description: `Check if ${modelName} exists given an id. Returns true if it exists, false otherwise.`,
        params: {id: "id to look for"},
        token: getServiceToken(),
        emitEvent: true
    })

    app.get(actionUrlPrefix+'/read', async (req, res) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}`);
            if(result.isLoaded) {
                return res.json(result.data);
            }
            return res.json(false);
        } catch(e) {
            return res.status(500).json(false);
        }
    });

    context.actions.add({
        group: 'objects',
        name: 'read', //get last path element
        url: actionUrlPrefix+'/read',
        tag: modelName,
        description: `Read a ${modelName} given an id. Returns an object with the data of the ${modelName} if it exists, false otherwise.`,
        params: {id: "id to look for"},
        token: getServiceToken(),
        emitEvent: true
    })
}