import { ProtoModel, Schema, z, SessionDataType } from 'protobase'

export const PackageSchema = Schema.object({
    name: z.string().search().id()
}) 

export type PackageType = z.infer<typeof PackageSchema>;

export class PackageModel extends ProtoModel<PackageModel> {
    constructor(data: PackageType, session?: SessionDataType) {
        super(data, PackageSchema, session, "Package");
    }

    protected static _newInstance(data: any, session?: SessionDataType): PackageModel {
        return new PackageModel(data, session);
    }
}
