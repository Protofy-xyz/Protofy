import {Objects} from "app/bundles/objects";
import {AutoAPI} from 'protolib/api'
import {Protofy} from 'protolib/base'
import { Application } from 'express';

Protofy("type", "AutoAPI")
Protofy("object", "{{object}}")
const {name, prefix} = Objects.{{object}}.getApiOptions()

const {{name}}API = AutoAPI({
    modelName: name,
    modelType: Objects.{{object}},
    initialDataDir: __dirname,
    prefix: prefix
})

export default (app:Application, context) => {
    {{name}}API(app, context)   
}