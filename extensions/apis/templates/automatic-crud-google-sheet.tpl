/*

This is an Automatic LCRUD API with custom storage layer.
getDB provides iterator, get and put. 
The storage layer used by generateApi/AutoAPI to interact with the storage

app is an express object, you can use app.get/app.post to create new endpoints
you can define newendpoints like:

app.get('/api/v1/testapi', (req, res, next) => {
    //you code goes here
    //reply with res.send(...)
})

the session argument is a session object, with the following shape:
{
    user: { admin: boolean, id: string, type: string },
    token: string,
    loggedIn: boolean
}

use the chat if in doubt
*/


import { AutoActions, AutoAPI, getServiceToken } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import APIContext from "app/bundles/context";
import { Application } from "express";
import {GoogleSheetClient} from '@extensions/google/googleSheetClient'
import fsPath from "path";
import { {{modelName}} } from '../objects/{{object}}'

const root = fsPath.join(process.cwd(), '..', '..')
const logger = getLogger();

Protofy("type", "AutoAPI");
Protofy("object", "{{object}}");
const { name, prefix } = {{modelName}}.getApiOptions();

const idField = {{modelName}}.getIdField()

const spreadsheetId = '{{param}}';

const getCredentials = async () => {
    const key = await API.get('/api/core/v1/keys/google_key?token='+getServiceToken())
    const mail = await API.get('/api/core/v1/keys/google_mail?token='+getServiceToken())

    return {
        client_email: mail.data.value,
        private_key: key.data.value.replace(/\\n/g, '\n')
    }
}

export default Protofy("code", async (app: Application, context: typeof APIContext) => {

    const {{codeName}}Actions = AutoActions({
        modelName: name,
        modelType: {{modelName}},
        prefix: prefix,
        pageSrc: '/workspace/objects/view?object={{object}}Model&mode=embed'
    })

    const {{codeName}}API = AutoAPI({
        modelName: name,
        modelType: {{modelName}},
        initialData: {},
        prefix: prefix,
        getDB: (path, req, session) => {
            const db = {
                async *iterator() {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, {{modelName}}.getObjectFields())
                    const elements = await client.getSpreadSheetElements()
                    for (const element of elements) {
                        yield [element.id, JSON.stringify(element)];
                    }
                },

                async put(key, value) {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, {{modelName}}.getObjectFields())
                    return client.put(key, value)
                },

                async get(key) {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, {{modelName}}.getObjectFields())
                    return client.get(key)
                },

                async del(key) {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, {{modelName}}.getObjectFields())
                    client.deleteId(key)
                }
            };

            return db;
        },
    });

    {{codeName}}API(app, context)
    {{codeName}}Actions(app, context)
})