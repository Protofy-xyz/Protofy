import { z, Schema, AutoModel, Protofy } from "protobase";

Protofy("features", {
    "adminPage": "/settings"
})

export const SettingSchema = Schema.object(Protofy("schema", {
	name: z.string().id().search(),
	value: z.string().display(['add', 'edit'])
}))

Protofy("api", {
    "name": "settings",
    "prefix": "/api/core/v1/"
})

export type SettingType = z.infer<typeof SettingSchema>;
export const SettingModel = AutoModel.createDerived<SettingType>("SettingModel", SettingSchema);
