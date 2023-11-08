import {Protofy} from 'protolib/base'
import {ZodObject, z} from 'zod'
import {handler} from 'protolib/api'
import {runTask} from 'protolib/adminpanel/bundles/tasks/api/taskApi'

export const {{capitalizedName}}TaskApi = (app) => {
    app.get(Protofy("apiRoute", "/api/v1/{{name}}Action"), handler(async (req:any, res:any, session) => {
        const {token, ...parameters} = req.query
        runTask('{{name}}', parameters, session, 
            (result) => res.send(result),
            (err)=>res.status(500).send(`An error occurred: ${(err as Error).message}`),
            ()=>res.status(404).send(`Task ${name} not found.`)
        )
    }))
}