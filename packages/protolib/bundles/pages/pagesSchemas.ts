import { z } from "protolib/base";
import { Schema, ProtoModel } from 'protolib/base'
import { SessionDataType } from "../../api";

export const PageSchema = Schema.object({
    name: z.string().search().id(),
    route: z.string().search(),
    protected: z.boolean().generate(() => false).label("Require user"),
    permissions: z.array(z.string()).label("Permissions").generate(() => []),
}) 

export type PageType = z.infer<typeof PageSchema>;

export type ObjectType = z.infer<typeof PageSchema>;
export class PageModel extends ProtoModel<PageModel> {
    constructor(data: ObjectType, session?: SessionDataType) {
        super(data, PageSchema, session);
    }

    getDefaultFilePath() {
        return '/packages/app/bundles/custom/pages/'+this.data.name+'.tsx'
    }

    protected static _newInstance(data: any, session?: SessionDataType): PageModel {
        return new PageModel(data, session);
    }
}
