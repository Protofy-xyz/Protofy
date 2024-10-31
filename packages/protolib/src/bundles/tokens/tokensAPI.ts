import { TokenModel } from "./tokensSchemas";
import { handler, AutoAPI, getServiceToken,getDeviceToken } from 'protonode'
import { API } from 'protobase'


export const tokensAutoAPI = AutoAPI({
    modelName: 'tokens',
    modelType: TokenModel, 
    prefix: '/api/core/v1/',
    dbName: 'tokens',
    requiresAdmin: ['*']
})

export const TokensAPI = (app, context) => {
    tokensAutoAPI(app, context)

    app.get('/api/core/v1/tokens/:type/create', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
          res.status(401).send({ error: "Unauthorized" });
          return;
        }
        if(!req.params.type) {
            res.status(400).send({ error: "Type is required" });
            return;
        }
        //generate a device token if type is device
        if(req.params.type == 'device') {
            const token = getDeviceToken(req.query.deviceId, false)
            // console.log('token',token)
            // //const tokenObj = new TokenModel(data,session)
            // //await API.post('/api/core/v1/events?token='+getServiceToken(), , undefined, true)
            res.send({token})
            return
        }
        //generate a service token if type is service
        if(req.params.type == 'service') {
            const token = getServiceToken()
            res.send({token})
            return
        }
        res.status(400).send({ error: "Invalid type" });
    }))
}
