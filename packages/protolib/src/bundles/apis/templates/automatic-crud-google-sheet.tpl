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

import { Objects } from "app/bundles/objects";
import { AutoAPI, getServiceToken } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import { Application } from "express";
import {GoogleSheetClient} from 'protolib/bundles/google/googleSheetClient'
import fsPath from "path";

const root = fsPath.join(process.cwd(), '..', '..')
const logger = getLogger();

Protofy("type", "AutoAPI");
Protofy("object", "{{object}}");
const { name, prefix } = Objects.{{object}}.getApiOptions();

const idField = Objects.{{object}}.getIdField()

const spreadsheetId = '{{param}}';

const getCredentials = async () => {
    const key = await API.get('/adminapi/v1/keys/google_key?token='+getServiceToken())
    const mail = await API.get('/adminapi/v1/keys/google_mail?token='+getServiceToken())

    return {
        client_email: mail.data.value,
        private_key: key.data.value.replace(/\\n/g, '\n')
    }
}

export default Protofy("code", async (app: Application, context) => {
    const {{codeName}}API = AutoAPI({
        modelName: name,
        modelType: Objects.{{object}},
        initialData: {},
        prefix: prefix,
        getDB: (path, req, session) => {
            const db = {
                async *iterator() {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, Objects.{{object}}.getObjectFields())
                    const elements = await client.getSpreadSheetElements()
                    for (const element of elements) {
                        yield [element.id, JSON.stringify(element)];
                    }
                },

                async put(key, value) {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, Objects.{{object}}.getObjectFields())
                    return client.put(key, value)
                },

                async get(key) {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, Objects.{{object}}.getObjectFields())
                    return client.get(key)
                },

                async del(key) {
                    const client = new GoogleSheetClient(await getCredentials(), spreadsheetId, "{{object}}", idField, Objects.{{object}}.getObjectFields())
                    client.deleteId(key)
                }
            };

            return db;
        },
    });

    {{codeName}}API(app, context)
})