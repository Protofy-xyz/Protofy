import { API, getLogger, ProtoMemDB, generateEvent } from 'protobase';
import {getServiceToken} from 'protonode';
const logger = getLogger();

export const appendContext = async (options: {
    chunk?: string,
    group?: string,
    tag: string,
    name: string,
    value: any,
    emitEvent?: boolean,
    limit?: number,
    done?: (value) => {},
    error?: (err) => {}
}) => {
    const inCore = global.appName == 'core'
    const group = options.group || 'system'
    const name = options.name
    const tag = options.tag
    const value = options.value
    const chunk = options.chunk || 'states'
    const done = options.done || ((value) => {});
    const error = options.error;
    const limit = options.limit || 100;

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
            throw new Error("appendContext is not supported outside core environments. Use setContext instead.");
        } else {
            let prevData = ProtoMemDB(chunk).get(group, tag, name)
            if(!prevData || !Array.isArray(prevData)) {
                prevData = [];
            }
            //append the new value and limit the size, removing the oldest if necessary
            prevData.push(value);
            if(prevData.length > limit) {
                prevData = prevData.slice(-limit);
            }

            ProtoMemDB(chunk).set(group, tag, name, prevData)
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