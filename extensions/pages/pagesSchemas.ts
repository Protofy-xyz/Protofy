import { ProtoModel, Schema, optional, z, SessionDataType, Protofy } from 'protobase'

Protofy("features", {
    "adminPage": "/pages"
})

export const PageSchema = Schema.object(Protofy("schema", {
    name: z.string().search().id(),
    route: z.string().search(),
    permissions: z.array(z.string()).label("Permissions").generate(() => []),
    web: z.boolean().defaultValue(true),
    electron: z.boolean().hidden().defaultValue(false),
    adminpanel: z.boolean().hidden().defaultValue(false).generate(() => false),
    mobile: z.boolean().optional().hidden().defaultValue(false),
    protected: z.boolean().defaultValue(false).label("Require user"),
    object: z.string().optional().hidden(),
    status: z.object({
        web: z.string().optional(),
        electron: z.string().optional(),
        mobile: z.string().optional()
    }).optional().hidden()
}))

Protofy("api", {
    "name": "pages",
    "prefix": "/api/core/v1/"
})

export type PageType = z.infer<typeof PageSchema>;

export type ObjectType = z.infer<typeof PageSchema>;
export class PageModel extends ProtoModel<PageModel> {
    constructor(data: ObjectType, session?: SessionDataType) {
        super(data, PageSchema, session, "Page");
    }

    getDefaultFilePath() {
        return '/packages/app/pages/'+this.data.name+'.tsx'
    }

    protected static _newInstance(data: any, session?: SessionDataType): PageModel {
        return new PageModel(data, session);
    }
}
