import { API, getLogger, ProtoMemDB, generateEvent } from 'protobase';
import {getServiceToken} from 'protonode';
const logger = getLogger();

const inCore = global.appName == 'core'

export const setContext = async (options: {
    chunk?: string,
    group?: string,
    tag: string,
    name: string,
    value: any,
    emitEvent?: boolean,
    done?: (value) => {},
    error?: (err) => {}
}) => {
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const value = options.value
    const chunk = options.chunk || 'states'
    const done = options.done || ((value) => {});
    const error = options.error;

    if(!name) {
        logger.error({}, "State name is required");
        return
    }

    if(!tag) {
        logger.error({}, "State tag is required");
        return
    }

    try {
        if(!inCore) {
            // console.log('Setting value using api: ', value, 'for', group, tag, name)
            const result = await API.post(`/api/core/v1/protomemdb/${chunk}/${group}/${tag}/${name}?token=`+getServiceToken(), {value: value??''}) 
            
            if(result && result.status == 'loaded' && result.data.changed && options.emitEvent) {
                generateEvent({
                    path: `${chunk}/${group}/${tag}/${name}/update`, 
                    from: "states",
                    user: 'system',
                    payload:{value: value},
                    ephemeral: true
                }, getServiceToken())
            }
            done(value)
        } else {
            const prevData = ProtoMemDB(chunk).get(group, tag, name)
            //deep compare
            if(JSON.stringify(prevData) === JSON.stringify(value)) {
                return
            }
            ProtoMemDB(chunk).set(group, tag, name, value)
            // console.log('setting locally', value, 'for', group, tag, name)
            if(options.emitEvent) {
                generateEvent({
                    path: `${chunk}/${group}/${tag}/${name}/update`, 
                    from: "states",
                    user: 'system',
                    payload:{value: value},
                    ephemeral: true
                }, getServiceToken())
            }
            done(value)
        }     
    } catch(err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}