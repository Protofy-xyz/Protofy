import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z  } from 'protobase'

const logger = getLogger()
Protofy("features", {
    "adminPage": "/objects/view?object=metasearchModel"
})

export const BaseMetasearchSchema = Schema.object(Protofy("schema", {
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BaseMetasearchSchema.shape).some(key => BaseMetasearchSchema.shape[key]._def.id)

export const MetasearchSchema = Schema.object({
    ...(!hasId? BaseSchema.shape : {}),
    ...BaseMetasearchSchema.shape
});

export type MetasearchType = z.infer<typeof MetasearchSchema>;

export class MetasearchModel extends ProtoModel<MetasearchModel> {
    constructor(data: MetasearchType, session?: SessionDataType, ) {
        super(data, MetasearchSchema, session, "Metasearch");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": "metasearch",
            "prefix": "/api/v1/"
        })
    }

    create(data?):MetasearchModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): MetasearchType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: MetasearchModel, data?: MetasearchType): MetasearchModel {
        const result = super.update(updatedModel, data)
        return result
    }

	list(search?, session?, extraData?, params?, jsCode?): MetasearchType[] {
        const result = super.list(search, session, extraData, params, jsCode)
        return result
    }

    delete(data?): MetasearchModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): MetasearchModel {
        return new MetasearchModel(data, session);
    }

    static load(data: any, session?: SessionDataType): MetasearchModel {
        return this._newInstance(data, session);
    }
}
