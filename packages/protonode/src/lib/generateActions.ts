import { API } from "protobase";
import { getServiceToken } from "./serviceToken";

export const AutoActions = ({
    modelName,
    modelType,
    prefix = "/api/v1/"
}) => async (app, context) => {
    const urlPrefix = `${prefix}${modelName}`;
    const actionUrlPrefix = `${prefix}actions/${modelName}`;

    //exists
    app.get(actionUrlPrefix + '/exists', async (req, res) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}`);
            if (result.isLoaded) {
                return res.json(true);
            }
            return res.json(false);
        } catch (e) {
            return res.status(500).json(false);
        }
    });

    await context.actions.add({
        group: 'objects',
        name: 'exists', //get last path element
        url: actionUrlPrefix + '/exists',
        tag: modelName,
        description: `Check if ${modelName} exists given an id. Returns true if it exists, false otherwise.`,
        params: { id: "id to look for" },
        token: getServiceToken(),
        emitEvent: true
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'exists',
        id: 'object_' + modelName + '_exists',
        templateName: 'Check if a ' + modelName + ' object exists',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-check',
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

    //read

    app.get(actionUrlPrefix + '/read', async (req, res) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}`);
            if (result.isLoaded) {
                return res.json(result.data);
            }
            return res.json(false);
        } catch (e) {
            return res.status(500).json(false);
        }
    });


    await context.actions.add({
        group: 'objects',
        name: 'read', //get last path element
        url: actionUrlPrefix + '/read',
        tag: modelName,
        description: `Read a ${modelName} given an id. Returns an object with the data of the ${modelName} if it exists, false otherwise.`,
        params: { id: `id of the ${modelName} to read` },
        token: getServiceToken(),
        emitEvent: true
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'read',
        id: 'object_' + modelName + '_read',
        templateName: 'Read a ' + modelName +' object',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-search',
            displayResponse: true,
            name: 'read_product',
            type: 'action',
            description: `Reads a ${modelName} given an id. Returns the content of the object if it exists, false otherwise.`,
            params: {
                id: `id of the ${modelName} to read`
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/read", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })

    //create

    app.post(actionUrlPrefix + '/create', async (req, res) => {
        const params = req.body;
        try {
            const result = await API.post(`${urlPrefix}`, params);
            if (result.isLoaded) {
                return res.json(result.data);
            }
            return res.json(false);
        } catch (e) {
            return res.status(500).json(false);
        }
    });

    const def = modelType.getObjectFieldsDefinition()
    const params = Object.keys(def).map((key) => {
        return {
            [key]: def[key].description + " (" + def[key].type + ")" + (def[key].isId ? " (this will be used as the id of the element)" : "")
        }
    }).reduce((acc, val) => ({ ...acc, ...val }), {});

    await context.actions.add({
        group: 'objects',
        name: 'create', //get last path element
        url: actionUrlPrefix + '/create',
        tag: modelName,
        description: `Creates a new ${modelName} given an object with the data. Returns the id of the new ${modelName}.`,
        params: params,
        token: getServiceToken(),
        emitEvent: true,
        method: 'post'
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'create',
        id: 'object_' + modelName + '_create',
        templateName: 'Create a ' + modelName + ' object',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-plus',
            displayResponse: true,
            name: 'create_product',
            type: 'action',
            description: `Creates a ${modelName} given its content. Returns the created ${modelName}.`,
            params,
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/create", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })

    //delete
    app.get(actionUrlPrefix + '/delete', async (req, res) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}/delete`);
            if (result.isLoaded) {
                return res.json(true);
            }
            return res.json(false);
        } catch (e) {
            return res.status(500).json(false);
        }
    });

    await context.actions.add({
        group: 'objects',
        name: 'delete', //get last path element
        url: actionUrlPrefix + '/delete',
        tag: modelName,
        description: `Deletes a ${modelName} given an id. Returns true if it was deleted, false otherwise.`,
        params: { id: "id of the " + modelName + " to delete" },
        token: getServiceToken(),
        emitEvent: true
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'delete',
        id: 'object_' + modelName + '_delete',
        templateName: 'Delete a ' + modelName + ' object',
        defaults: {
            icon: 'trash2',
            displayResponse: true,
            name: 'delete_product',
            type: 'action',
            description: `Deletes a ${modelName} by id. Returns true if it was deleted, false otherwise.`,
            params: {
                id: 'id of the ' + modelName + ' to delete'
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/delete", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })

    //update
    app.get(actionUrlPrefix + '/update', async (req, res) => {
        const params = req.query;
        const id = params.id;
        const field = params.field;
        const value = params.value;
        try {
            const result = await API.get(`${urlPrefix}/${id}`);
            if (result.isLoaded) {
                const data = result.data;
                data[field] = value;
                const resultUpdate = await API.post(`${urlPrefix}/${id}`, data);
                if (resultUpdate.isLoaded) {
                    return res.json(resultUpdate.data);
                }
            }
        } catch (e) {
            return res.status(500).json(false);
        }
    });

    const updateParams = {
        id: `id of the ${modelName} to update`,
        field: `field to update in the ${modelName}. Possible fields: ${Object.keys(def).join(", ")}`,
        value: `new value for the field`
    }

    await context.actions.add({
        group: 'objects',
        name: 'update', //get last path element
        url: actionUrlPrefix + '/update',
        tag: modelName,
        description: `Updates a ${modelName} by id, changing field with a given value. Returns the updated ${modelName} if it was updated, false otherwise.`,
        params: updateParams,
        token: getServiceToken(),
        emitEvent: true
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'update',
        id: 'object_' + modelName + '_update',
        templateName: 'Updates a ' + modelName + ' object',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-pen-line',
            displayResponse: true,
            name: 'update_product',
            type: 'action',
            description: `Updates a ${modelName} by id, changing field with a given value. Returns the updated ${modelName} if it was updated, false otherwise.`,
            params: updateParams,
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/update", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })
}