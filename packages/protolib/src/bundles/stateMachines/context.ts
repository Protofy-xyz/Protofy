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

const getStateMachine = async (options: {
    instanceName: string, 
    done?: (result) => void
    error?: (err) => void
}) => {
    const {instanceName, done, error} = options
    const url = `/api/v1/statemachines/${instanceName}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        error && error(result.error)
        throw result.error
    }

    console.log(instanceName + "' state machine: ", result.data)
    done && await done(result.data)
    return result.data 
}

const stateMachineFilter = async (options: {
    instanceName: string, 
    state: string, 
    then?: () => void, 
    otherwise?: () => void, 
    error?: (err) => void 
}) => {
    const {instanceName, state, then, otherwise, error} = options
    const url = `/api/v1/statemachines/${instanceName}?token=${getServiceToken()}`
    let result = await API.get(url)
    if (result.isError) {
        error && error(result.error)
        throw result.error
    }

    if (result.data.state === state) {
        then && await then()
    } else {
        otherwise && await otherwise()
    }

    console.log(instanceName + "' state machine state: ", result.data)
}

export default {
    spawnStateMachine,
    emitToStateMachine, 
    getStateMachine, 
    stateMachineFilter 
}