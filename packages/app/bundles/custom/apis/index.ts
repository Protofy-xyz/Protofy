import {Protofy} from 'protolib/base'

const autoApis = Protofy("apis", {})

export default (app) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app)
    })
}