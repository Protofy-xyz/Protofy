import {Objects} from "app/bundles/objects";
import {AutoAPI} from 'protolib/api'

const {name, prefix} = Objects.{{name}}.getApiOptions()

const {{capitalizedName}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{name}},
    initialData: {}, // {"key": {...}, ....}
    prefix: prefix
})

export default {{capitalizedName}}API