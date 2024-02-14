import { handler } from 'protolib/api'
import { Protofy, getLogger, API } from '../../base'
import { getServiceToken } from '../../api/lib/serviceToken'

const logger = getLogger()

Protofy("type", "CustomAPI")

export function MasksAPI(app, context) {
    app.post('/adminapi/v1/mask', handler(async (req, res, session, next) => {
        const path = "/packages/app/bundles/custom/masks/custom.masks.json".replace(/\/+/g, '/')
        const currentMasks = await API.get('/adminapi/v1/files/' + path + '?token=' + getServiceToken())
        
        const maskData = req.body

        const newMask = {
            "id": maskData.name,
            "title": maskData.name,
            "path": "*",
            "type": maskData.type,
            "filter": {
                "name": maskData.name
            },
            "body": [
                {
                    "type": "protolibProps",
                    "data": maskData.data
                },
                {
                    "type": "child",
                    "data": [
                        {
                            "label": "Child1",
                            "field": "child-1",
                            "fieldType": "child",
                            "type": "child"
                        }
                    ]
                }
            ]
        }

        const newMasks = [...currentMasks.data, newMask]

        await API.post('/adminapi/v1/files/' + path + '?token=' + getServiceToken(), {
            content: JSON.stringify(newMasks, null, 4)
        })

        res.send({ result: "created" })

    }))
}


