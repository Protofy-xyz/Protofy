import {Protofy} from 'protolib/base'
import {z} from 'protolib/base'
import {handler} from 'protolib/api'
import {runTask} from 'protolib/bundles/tasks/api/taskRunApi'

export const {{capitalizedName}}TaskApi = (app) => {
    app.get(Protofy("apiRoute", "{{apiRoute}}"), handler(async (req:any, res:any, session) => {
        const {token, ...parameters} = req.query
        runTask('{{name}}', parameters, session, 
            (result) => res.send(result),
            (err)=>res.status(500).send(`An error occurred: ${(err as Error).message}`),
            ()=>res.status(404).send(`Task ${name} not found.`)
        )
    }))
}