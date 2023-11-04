import {Objects} from "app/bundles/objects";
import {CreateApi} from 'protolib/api'

const {name, prefix} = Objects.{{name}}.getApiOptions()
const {{capitalizedName}}API = CreateApi(name, Objects.{{name}}, __dirname, prefix)

export default {{capitalizedName}}API