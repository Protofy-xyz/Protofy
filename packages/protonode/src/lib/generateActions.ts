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

    context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'exists',
        id: 'object_'+modelName+'_exists',
        templateName: 'Check if '+modelName+' exists',
        defaults: {
            displayResponse: true,
            name: 'exists_product',
            type: 'action',
            description: `Check if ${modelName} exists given an id. Returns true if it exists, false otherwise.`,
            params: {
                id: 'id to look for'
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/exists", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
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

    app.post(actionUrlPrefix+'/create', async (req, res) => {
        const params = req.body;
        try {
            const result = await API.post(`${urlPrefix}`, params);
            if(result.isLoaded) {
                return res.json(result.data);
            }
            return res.json(false);
        } catch(e) {
            return res.status(500).json(false);
        }
    });

    const def = modelType.getObjectFieldsDefinition()
    const params = Object.keys(def).map((key) => {
        return {
            [key]: def[key].type+": "+def[key].description + (def[key].isId ? " (this will be used as the id of the element)" : "")
        }
    }).reduce((acc, val) => ({...acc, ...val}), {});

    context.actions.add({
        group: 'objects',
        name: 'create', //get last path element
        url: actionUrlPrefix+'/create',
        tag: modelName,
        description: `Creates a new ${modelName} given an object with the data. Returns the id of the new ${modelName}.`,
        params: params,
        token: getServiceToken(),
        emitEvent: true,
        method: 'post'
    })
}