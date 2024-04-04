import {Protofy} from 'protolib/base'
import jhnApi from "./jhn";

const autoApis = Protofy("apis", {
    jhn: jhnApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}