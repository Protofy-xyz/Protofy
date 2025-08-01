import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z  } from 'protobase'

const logger = getLogger()
Protofy("features", {
    "adminPage": "/objects/view?object=assetsModel"
})

export const BaseAssetsSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search(),
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BaseAssetsSchema.shape).some(key => BaseAssetsSchema.shape[key]._def.id)

export const AssetsSchema = Schema.object({
    ...(!hasId? BaseSchema.shape : {}),
    ...BaseAssetsSchema.shape
});

export type AssetsType = z.infer<typeof AssetsSchema>;

export class AssetsModel extends ProtoModel<AssetsModel> {
    constructor(data: AssetsType, session?: SessionDataType, ) {
        super(data, AssetsSchema, session, "Assets");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": "players",
            "prefix": "/api/v1/"
        })
    }

    create(data?):AssetsModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): AssetsType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: AssetsModel, data?: AssetsType): AssetsModel {
        const result = super.update(updatedModel, data)
        return result
    }

	list(search?, session?, extraData?, params?, jsCode?): AssetsType[] {
        const result = super.list(search, session, extraData, params, jsCode)
        return result
    }

    delete(data?): AssetsModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): AssetsModel {
        return new AssetsModel(data, session);
    }

    static load(data: any, session?: SessionDataType): AssetsModel {
        return this._newInstance(data, session);
    }
}
