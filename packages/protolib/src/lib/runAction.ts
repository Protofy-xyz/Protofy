import { API } from 'protobase'
export const runAction = async (action, params) => {
    console.log('Running action: ', action, 'with params: ', params)
    API.get(`/api/v1/automations/${action.name}` + (Object.keys(params).length > 0 ? "?" + Object.keys(params).map((key) => key + "=" + encodeURIComponent(params[key])).join("&") : ""))
}