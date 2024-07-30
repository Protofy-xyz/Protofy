import { getServiceToken } from "../apis/context"
import { API } from 'protobase'


const spawnStateMachine = async (options: {
    definitionName: string, 
    instanceName: string, 
    doneCb?: (result) => void, 
    errorCb?: (err) => void
}) => {
    const {definitionName, instanceName, doneCb, errorCb} = options

    const url = `/api/v1/statemachines?token=${getServiceToken()}`
    let result = await API.post(url, {
        name: instanceName,
        definition: {
            name: definitionName
        }
    })
    if (result.isError) {
        errorCb && errorCb(result.error)
        throw result.error
    }

    console.log('State machine created: ', result.data)
    doneCb && await doneCb(result.data)
    return result.data
}

const emitToStateMachine = async (options: {
    instanceName: string,
    emitType: string, 
    payload?: object,
    doneCb?: (result) => void
    errorCb?: (err) => void
}) => {
    const {instanceName, emitType, payload, doneCb, errorCb} = options
    const url = `/api/v1/statemachines/${instanceName}/emit?token=${getServiceToken()}`
    let result = await API.post(url, { emitType, payload })
    if (result.isError) {
        errorCb && errorCb(result.error)
        throw result.error
    }

    console.log("Emited to '" + instanceName + "' state machine: ", result.data)
    doneCb && await doneCb(result.data)
    return result.data
}

export default {
    spawnStateMachine,
    emitToStateMachine
}