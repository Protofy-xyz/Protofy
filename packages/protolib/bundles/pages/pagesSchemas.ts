import { ProtoModel, Schema, optional, z } from '../../base'
import { SessionDataType } from "../../api";

export const PageSchema = Schema.object({
    name: z.string().search().id(),
    route: z.string().search(),
    permissions: z.array(z.string()).label("Permissions").generate(() => []),
    web: z.boolean().defaultValue(true),
    electron: z.boolean().hidden().defaultValue(false),
    mobile: z.boolean().optional().hidden().defaultValue(false),
    protected: z.boolean().defaultValue(false).label("Require user"),
    object: z.string().optional().hidden(),
    status: z.object({
        web: z.string().optional(),
        electron: z.string().optional(),
        mobile: z.string().optional()
    }).optional().hidden()
}) 

export type PageType = z.infer<typeof PageSchema>;

export type ObjectType = z.infer<typeof PageSchema>;
export class PageModel extends ProtoModel<PageModel> {
    constructor(data: ObjectType, session?: SessionDataType) {
        super(data, PageSchema, session, "Page");
    }

    getDefaultFilePath() {
        return '/packages/app/bundles/custom/pages/'+this.data.name+'.tsx'
    }

    protected static _newInstance(data: any, session?: SessionDataType): PageModel {
        return new PageModel(data, session);
    }
}
