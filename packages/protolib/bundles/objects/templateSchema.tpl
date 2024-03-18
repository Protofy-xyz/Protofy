import { ProtoModel, SessionDataType, z } from "protolib/base";
import { Protofy, Schema, BaseSchema } from 'protolib/base'
import { getLogger } from 'protolib/base';

const logger = getLogger()
Protofy("features", {})

export const Base{{name}}Schema = Schema.object(Protofy("schema", {}))

export const {{name}}Schema = Schema.object({
    ...BaseSchema.shape,
    ...Base{{name}}Schema.shape
});

export type {{name}}Type = z.infer<typeof {{name}}Schema>;

export class {{name}}Model extends ProtoModel<{{name}}Model> {
    constructor(data: {{name}}Type, session?: SessionDataType, ) {
        super(data, {{name}}Schema, session, "{{name}}");
    }

    public static getApiOptions() {
        return {
            name: '{{pluralName}}',
            prefix: '/api/v1/'
        }
    }

    create(data?):{{name}}Model {
        return super.create(data)
    }

    read(extraData?): {{name}}Type {
        return super.read(extraData)
    }

    update(updatedModel: {{name}}Model, data?: {{name}}Type): {{name}}Model {
        return updatedModel.setId(this.getId(), { ...(data ? data : updatedModel.data) });
    }

	list(search?, session?, extraData?): {{name}}Type[] {
        return super.list(search, session, extraData)
    }

    delete(data?): {{name}}Model {
        return super.delete(data)

    }

    protected static _newInstance(data: any, session?: SessionDataType): {{name}}Model {
        return new {{name}}Model(data, session);
    }
}
