import { API } from "protobase";
import {handler} from "protonode";
import { getServiceToken } from "./serviceToken";

export const AutoActions = ({
    modelName,
    modelType,
    apiUrl = undefined,
    prefix = "/api/v1/",
    pageSrc = undefined
}) => async (app, context) => {
    const urlPrefix = apiUrl ?? `${prefix}${modelName}`;
    const actionUrlPrefix = `${prefix}actions/${modelName}`;

    //exists
    app.get(actionUrlPrefix + '/exists', handler(async (req, res, session) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}?token=${session.token}`);
            if (result.isLoaded) {
                res.json(true);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

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
        templateName: 'Check if a ' + modelName + ' exists in the storage',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-check',
            displayResponse: true,
            name: `exists ${modelName}`,
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
    app.get(actionUrlPrefix + '/read', handler(async (req, res, session) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}?token=${session.token}`);
            if (result.isLoaded) {
                fixValues(result.data, modelType);
                res.json(result.data);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))


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
        templateName: 'Read a ' + modelName + ' from the storage',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-search',
            displayResponse: true,
            name: `read ${modelName}`,
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
    const fixValues = (params, modelType) => {
        Object.keys(params).forEach((key) => {
            // checkea los tipos de parametros para convetiros a los tipos correctos
            if (modelType.getObjectFieldsDefinition()[key].type === 'number') {
                params[key] = Number(params[key]);
            }
            if (modelType.getObjectFieldsDefinition()[key].type === 'boolean') {
                params[key] = Boolean(params[key]);
            }
        })
    }

    app.post(actionUrlPrefix + '/create', handler(async (req, res, session) => {
        const params = req.body;
        console.log(JSON.stringify(params));
        fixValues(params, modelType);
        try {
            const result = await API.post(`${urlPrefix}?token=${session.token}`, params);
            console.log(result)
            if (result.isLoaded) {
                res.json(result.data);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

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
        templateName: 'Create a ' + modelName + ' in the storage',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-plus',
            displayResponse: true,
            name: `create ${modelName}`,
            type: 'action',
            description: `Creates a ${modelName} given its content. Returns the created ${modelName}.`,
            params,
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/create", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })

    //delete
    app.get(actionUrlPrefix + '/delete', handler(async (req, res, session) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}/delete?token=${session.token}`);
            if (result.isLoaded) {
                res.json(true);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

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
        templateName: 'Delete a ' + modelName + ' from the storage',
        defaults: {
            icon: 'trash',
            displayResponse: true,
            name: `delete ${modelName}`,
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
    app.get(actionUrlPrefix + '/update', handler(async (req, res, session) => {
        const params = req.query;
        fixValues(params, modelType);
        const id = params.id;
        const field = params.field;
        const value = params.value;
        try {
            const result = await API.get(`${urlPrefix}/${id}`);
            if (result.isLoaded) {
                const data = result.data;
                data[field] = value;
                const resultUpdate = await API.post(`${urlPrefix}/${id}?token=${session.token}`, data);
                if (resultUpdate.isLoaded) {
                    res.json(resultUpdate.data);
                    return
                }
            }
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

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
        templateName: 'Updates a ' + modelName + ' in the storage',
        defaults: {
            width: 4,
            height: 8,
            icon: 'file-pen-line',
            displayResponse: true,
            name: `update ${modelName}`,
            type: 'action',
            description: `Updates a ${modelName} by id, changing field with a given value. Returns the updated ${modelName} if it was updated, false otherwise.`,
            params: updateParams,
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/update", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })

    context.onEvent(
        context.mqtt,
        context,
        async (event) => {
            context.state.set({ group: 'objects', tag: modelName, name: 'lastCreated', value: event?.payload?.data});
            context.state.set({ group: 'objects', tag: modelName, name: 'lastCreatedMetadata', value: event});
            context.state.set({ group: 'objects', tag: modelName, name: 'lastCreatedId', value: event?.payload?.id});
        },
        modelName + "/create/#"
    )

    context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'lastCreated',
        templateName: 'Last created ' + modelName,
        id: 'object_' + modelName + '_lastCreated',
        defaults: {
            type: "value",
            icon: 'rss',
            name: `lastCreated ${modelName}`,
            description: `Last Created ${modelName}`,
            rulesCode: `return states.objects?.${modelName}.lastCreated;`,
        },
        emitEvent: true,
        token: getServiceToken()
    })

    context.onEvent(
        context.mqtt,
        context,
        async (event) => {
            context.state.set({ group: 'objects', tag: modelName, name: 'lastUpdated', value: event?.payload?.data});
            context.state.set({ group: 'objects', tag: modelName, name: 'lastUpdatedMetadata', value: event});
            context.state.set({ group: 'objects', tag: modelName, name: 'lastUpdatedId', value: event?.payload?.id});
        },
        modelName + "/update/#"
    )

    context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'lastUpdated',
        templateName: 'Last updated ' + modelName,
        id: 'object_' + modelName + '_lastUpdated',
        defaults: {
            type: "value",
            icon: 'rss',
            name: `lastUpdated ${modelName}`,
            description: `Last updated ${modelName}`,
            rulesCode: `return states.objects?.${modelName}.lastUpdated;`,
        },
        emitEvent: true,
        token: getServiceToken()
    })


    app.get(actionUrlPrefix + '/list', handler(async (req, res, session) => {
        const params = req.query;
        const itemsPerPage = params.itemsPerPage;
        const page = params.page
        const search = params.search;
        const orderBy = params.orderBy;
        const orderDirection = params.orderDirection;

        const finalUrl = `${urlPrefix}?token=${session.token}&${itemsPerPage ? `itemsPerPage=${itemsPerPage}` : ''}${page ? `&page=${page}` : ''}${search ? `&search=${search}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}${orderDirection ? `&orderDirection=${orderDirection}` : ''}`;
        try {
            const result = await API.get(finalUrl);
            if (result.isLoaded) {
                // fixValues(result.data, modelType);
                res.json(result.data.items);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

     await context.actions.add({
        group: 'objects',
        name: 'list', //get last path element
        url: actionUrlPrefix + '/list',
        tag: modelName,
        description: `Returns a list of ${modelName} objects. You can filter the results by passing itemsPerPage, page, search, orderBy and orderDirection parameters.`,
        params: {
            itemsPerPage: 'number of items per page (optional)',
            page: 'page number to retrieve (optional)' ,
            search: 'search term to filter the results (optional)',
            orderBy: 'field to order the results by (optional)',
            orderDirection: 'direction to order the results by (asc or desc) (optional)'
        },
        token: getServiceToken(),
        emitEvent: true
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'list',
        id: 'object_' + modelName + '_list',
        templateName: modelName + ' storage',
        defaults: {
            icon: 'search',
            displayResponse: true,
            name: `list ${modelName}`,
            ...(pageSrc ? {html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: iframe({src:'"+pageSrc+"'}), mode: 'slim'\n});\n"}: {}),
            type: 'action',
            description: `Returns a list of ${modelName} objects. You can filter the results by passing itemsPerPage, page, search, orderBy and orderDirection parameters.`,
            params: {
                itemsPerPage: 'number of items per page (optional)',
                page: 'page number to retrieve (optional)' ,
                search: 'search term to filter the results (optional)',
                orderBy: 'field to order the results by (optional)',
                orderDirection: 'direction to order the results by (asc or desc) (optional)'
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/list", userParams)`
        },
        emitEvent: true,
        token: getServiceToken()
    })
}