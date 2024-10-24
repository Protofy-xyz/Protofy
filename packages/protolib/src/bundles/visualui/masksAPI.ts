import { handler, getServiceToken } from 'protonode'
import { Protofy, getLogger, API } from 'protobase'

const logger = getLogger()

Protofy("type", "CustomAPI")

export function MasksAPI(app, context) {
    app.post('/api/core/v1/mask', handler(async (req, res, session, next) => {
        const path = "/packages/app/masks/custom.masks.json".replace(/\/+/g, '/')
        const currentMasks = await API.get('/api/core/v1/files/' + path + '?token=' + getServiceToken())
        
        const newMask = req.body

        const newMasks = [...currentMasks.data, newMask]

        await API.post('/api/core/v1/files/' + path + '?token=' + getServiceToken(), {
            content: JSON.stringify(newMasks, null, 4)
        })

        res.send({ result: "created" })

    }))
}


