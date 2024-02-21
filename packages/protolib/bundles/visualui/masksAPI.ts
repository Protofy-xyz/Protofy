import { handler } from 'protolib/api'
import { Protofy, getLogger, API } from '../../base'
import { getServiceToken } from '../../api/lib/serviceToken'

const logger = getLogger()

Protofy("type", "CustomAPI")

export function MasksAPI(app, context) {
    app.post('/adminapi/v1/mask', handler(async (req, res, session, next) => {
        const path = "/packages/app/bundles/custom/masks/custom.masks.json".replace(/\/+/g, '/')
        const currentMasks = await API.get('/adminapi/v1/files/' + path + '?token=' + getServiceToken())
        
        const newMask = req.body

        const newMasks = [...currentMasks.data, newMask]

        await API.post('/adminapi/v1/files/' + path + '?token=' + getServiceToken(), {
            content: JSON.stringify(newMasks, null, 4)
        })

        res.send({ result: "created" })

    }))
}


