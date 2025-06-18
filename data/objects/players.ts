import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z  } from 'protobase'

const logger = getLogger()
Protofy("features", {
    "adminPage": "/objects/view?object=playersModel"
})

export const BasePlayersSchema = Schema.object(Protofy("schema", {
	name: z.string(),
	score: z.number()
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BasePlayersSchema.shape).some(key => BasePlayersSchema.shape[key]._def.id)

export const PlayersSchema = Schema.object({
    ...(!hasId? BaseSchema.shape : {}),
    ...BasePlayersSchema.shape
});

export type PlayersType = z.infer<typeof PlayersSchema>;

export class PlayersModel extends ProtoModel<PlayersModel> {
    constructor(data: PlayersType, session?: SessionDataType, ) {
        super(data, PlayersSchema, session, "Players");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": "players",
            "prefix": "/api/v1/"
        })
    }

    create(data?):PlayersModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): PlayersType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: PlayersModel, data?: PlayersType): PlayersModel {
        const result = super.update(updatedModel, data)
        return result
    }

	list(search?, session?, extraData?, params?): PlayersType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): PlayersModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): PlayersModel {
        return new PlayersModel(data, session);
    }

    static load(data: any, session?: SessionDataType): PlayersModel {
        return this._newInstance(data, session);
    }
}
