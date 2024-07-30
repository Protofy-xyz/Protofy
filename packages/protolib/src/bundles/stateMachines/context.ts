import { getServiceToken } from "../apis/context"
import { API } from 'protobase'


const spawnStateMachine = async (options: {
    definitionName: string, 
    instanceName: string, 
    done?: (result) => void, 
    error?: (err) => void
}) => {
    const {definitionName, instanceName, done, error} = options

    const url = `/api/v1/statemachines?token=${getServiceToken()}`
    let result = await API.post(url, {
        name: instanceName,
        definition: {
            name: definitionName
        }
    })
    if (result.isError) {
        error && error(result.error)
        throw result.error
    }

    console.log('State machine created: ', result.data)
    done && await done(result.data)
    return result.data
}

const emitToStateMachine = async (options: {
    instanceName: string,
    emitType: string, 
    payload?: object,
    done?: (result) => void
    error?: (err) => void
}) => {
    const {instanceName, emitType, payload, done, error} = options
    const url = `/api/v1/statemachines/${instanceName}/emit?token=${getServiceToken()}`
    let result = await API.post(url, { emitType, payload })
    if (result.isError) {
        error && error(result.error)
        throw result.error
    }

    console.log("Emited to '" + instanceName + "' state machine: ", result.data)
    done && await done(result.data)
    return result.data
}

export default {
    spawnStateMachine,
    emitToStateMachine
}