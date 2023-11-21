import {Objects} from "app/bundles/objects";
import {AutoAPI} from 'protolib/api'

const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{capitalizedName}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialDataDir: __dirname,
    prefix: prefix
})

export default {{capitalizedName}}API