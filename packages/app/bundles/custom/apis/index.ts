import {Protofy} from 'protobase'

const autoApis = Protofy("apis", {})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}