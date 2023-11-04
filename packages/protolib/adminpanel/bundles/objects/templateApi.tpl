import {Objects} from "app/bundles/objects";
import {CreateApi} from 'protolib/api'

const {{capitalizedName}}API = CreateApi('{{pluralName}}', Objects.{{name}}, __dirname)
export default {{capitalizedName}}API