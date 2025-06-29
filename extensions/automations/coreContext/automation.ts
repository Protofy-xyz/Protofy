import { API, getLogger } from 'protobase';
import {getServiceToken} from 'protonode'
import {addAction} from '@extensions/actions/coreContext/addAction';
import {addCard} from '@extensions/cards/coreContext/addCard';

const logger = getLogger();

export const automation = async (options: {
    name: string,
    responseMode?: 'instant' | 'wait' | 'manual',
    automationParams?: any,
    tags?: string[],
    displayName?: string,
    description?: string,
    app: any,
    onRun?: (params, res, name?) => void
    onError?: (err) => void
}) => {
    const name = options.name
    const app = options.app
    const responseMode = options.responseMode || 'wait'
    const onRun = options.onRun || (() => {})
    const onError = options.onError

    if(!name) {
        logger.error({}, "Automation name is required");
        return
    }

    if(!app) {
        logger.error({}, "Automation app is required");
        return
    }

    try {
        const token = getServiceToken()
        //register in automations api
        await API.post('/api/core/v1/automations?token='+token, {
            name: name,
            displayName: options.displayName ?? name,
            responseMode: responseMode,
            automationParams: options.automationParams ?? {},
            description: options.description ?? "",
            tags: options.tags ?? []
        })

        //register in actions api
        addAction({
            group: 'automations',
            name: name.split('/').join('_'), //get last path element
            url: "/api/v1/automations/"+name,
            tag: options.tags && options.tags.length > 0 ? options.tags[0] : 'system',
            description: options.description ?? "",
            params: options.automationParams ?? {},
            responseKey: 'result',
            emitEvent: true,
            token: token
        })

        //add card
        addCard({
            group: 'automations',
            tag: 'actions',
            id: name.split('/').join('_'),
            templateName: 'Run '+name.split('/').join('_')+' action',
            name: 'automations_'+name.split('/').join('_'),
            defaults: {
                name: name.split('/').join('_'),
                description: options.description ?? "",
                rulesCode: `return execute_action("/api/v1/automations/${name}", userParams)`,
                params: options.automationParams ?? {},
                displayResponse: true,
                responseKey: 'result',
                type: 'action'
            },
            emitEvent: true,
            token: token
        })

        const url = "/api/v1/automations/"+name;
        app.get(url, async (req,res)=>{
            logger.trace({name, params: req.query}, "Automation executed: "+name)
            try {
                if(responseMode == 'instant') {
                    res.send({result: "started"})
                }
                await onRun(req.query, res, name)
                if(responseMode == 'wait') {
                    res.send({result: "done"})
                }
            } catch(err) {
                if(onError) {
                    onError(err)
                } else {
                    logger.error({name, params: req.query, error: err}, "Automation error: "+name)
                    res.status(424).send({error: err.message})
                }
            }
        })
    } catch (err) {
        logger.error({ error: err }, "Error in automation: "+name);
        onError && onError(err);
    }
}