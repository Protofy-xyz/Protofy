import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "protolib/base";

const getKey = async ({ key, done, error, hasSarviceToken = false }) => {
    var urlEnch = '/adminapi/v1/keys/' + key

    if (hasSarviceToken) {
        urlEnch = `${urlEnch}?token=${getServiceToken()}`
    }

    const result = await API.get(urlEnch)

    if (result.isError) {
        if (error) error(result.error)
        throw result.error
    }

    if (done) done(result.data?.value)

    return result.data?.value
}

export default {
    getKey
}