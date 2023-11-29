import {Objects} from "app/bundles/objects";
import {AutoAPI} from 'protolib/api'
import {Protofy} from 'protolib/base'

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{capitalizedName}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialDataDir: __dirname,
    prefix: prefix
})

export default {{capitalizedName}}API