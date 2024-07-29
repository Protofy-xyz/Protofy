import { getServiceToken } from "../apis/context"
import { API } from 'protobase'

const spawnStateMachine = async (definitionName, instaceName, errorCb?) => {
    const url = `/adminapi/v1/statemachines?token=${getServiceToken()}`
    let result = await API.post(url, {
        name: instaceName,
        definition: {
            name: definitionName
        }
    })
    if (result.isError) {
        errorCb && errorCb()
        throw result.error
    }

    console.log('State machine created: ', result.data)
    return result.data
}

export default {
    spawnStateMachine,
}