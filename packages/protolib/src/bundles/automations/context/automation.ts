import { getLogger } from 'protobase';
import { chromium, firefox, webkit } from 'playwright'; 

const logger = getLogger();

export const automation = async (options: {
    name: string,
    responseMode?: 'instant' | 'wait' | 'manual',
    app: any,
    onRun?: (params, res) => void
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
        const url = "/api/v1/automations/"+name;
        app.get(url, async (req,res)=>{
            logger.info({name, params: req.query}, "Automation executed: "+name)
            try {
                if(responseMode == 'instant') {
                    res.send({result: "started"})
                }
                await onRun(req.query, res)
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
        logger.error({ error: err }, "Error in navigate");
        onError(err);
    }
}