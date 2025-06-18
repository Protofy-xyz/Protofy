import { AutoActions, AutoAPI, getAuth, getServiceToken } from 'protonode'
import APIContext from "app/bundles/context";
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";
import { PlayersModel } from '../objects/players'

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "players")
const { name, prefix } = PlayersModel.getApiOptions()

const initialData = {
    "202506-181445-55040-afa0d805": {
        "name": "Protofito",
        "score": 50,
        "id": "202506-181445-55040-afa0d805"
    },
    "202506-181446-00634-fddae120": {
        "name": "Virgulini",
        "score": 33,
        "id": "202506-181446-00634-fddae120"
    },
    "202506-181446-46228-8b0f1c3d": {
        "name": "LCollective",
        "score": 10,
        "id": "202506-181446-46228-8b0f1c3d"
    },
    "202506-181446-91822-0f1b2e4c": {
        "name": "Protofy",
        "score": 70,
        "id": "202506-181446-91822-0f1b2e4c"
    }
}


const playersAPI = AutoAPI({
    modelName: name,
    modelType: PlayersModel,
    initialData: initialData,
    prefix: prefix,
})

const playersActions = AutoActions({
    modelName: name,
    modelType: PlayersModel,
    prefix: prefix,
    object: 'players'
})

export default Protofy("code", async (app: Application, context: typeof APIContext) => {
    playersAPI(app, context)
    playersActions(app, context)
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/players', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */
})