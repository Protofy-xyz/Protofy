import { z, Schema, AutoModel, Protofy } from "protobase";

Protofy("features", {
    "adminPage": "/themes"
})

export const ThemeSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search().static(),
	insertCSS: z.boolean().optional().hidden(),
    themes: z.any().optional().size(2),
    format: z.union([z.literal("json"), z.literal("css")]).optional().hidden()
}))

Protofy("api", {
    "name": "themes",
    "prefix": "/api/core/v1/"
})

export type ThemeType = z.infer<typeof ThemeSchema>;
export const ThemeModel = AutoModel.createDerived<ThemeType>("ThemeModel", ThemeSchema);
