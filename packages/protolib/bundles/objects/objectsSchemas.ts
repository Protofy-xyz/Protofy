import { z } from "protolib/base";
import { BaseSchema } from 'protolib/base'
import { AutoModel } from 'protolib/base'
import { ProtoModel } from "../../base";
import { SessionDataType } from "../../api";

export const BaseObjectSchema = z.object({
  id: z.string().search().id().generate((obj) => obj.name.charAt(0).toUpperCase() + obj.name.slice(1) + 'Model'),
  name: z.string().search().display().static(),
  api: z.boolean().optional(),
  keys: z.record(
    z.string().optional(),
    z.object({
      type: z.union([
        z.literal("string"),
        z.literal("number"),
        z.literal("boolean"),
        z.literal("array"),
        z.literal("object"),
        z.literal("record"),
        z.literal("union")
      ]),
      params: z.array(z.string()).optional(),
      modifiers: z.array(z.object({
        name: z.union([
          z.literal("id"),
          z.literal("search"),
          z.literal("generate"),
          z.literal("display"),
          z.literal("optional"),
          z.literal("email"),
          z.literal("label"),
          z.literal("hint"),
          z.literal("static"),
          z.literal("min"),
          z.literal("max"),
          z.literal("secret"),
          z.literal("onCreate"),
          z.literal("onUpdate"),
          z.literal("onRead"),
          z.literal("onDelete"),
          z.literal("onList"),
          z.literal("name")
        ]),
        params: z.array(z.string()).optional()
      }).name('name')).optional()
    }).name('name'))
    .generate({}).display()
  // data: z.string().search().display(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
  //from: z.string().search().display(), // system entity where the event was generated (next, api, cmd...)
  //user: z.string().generate((obj) => 'me').search(), // the original user that generates the action, 'system' if the event originated in the system itself
})

export const ObjectSchema = z.object({
  //...BaseSchema.shape,
  ...BaseObjectSchema.shape
});

export type ObjectType = z.infer<typeof ObjectSchema>;
export class ObjectModel extends ProtoModel<ObjectModel> {
  constructor(data: ObjectType, session?: SessionDataType) {
    super(data, ObjectSchema, session);
  }

  getDefaultAPIFilePath() {
    return '/packages/app/bundles/custom/apis/' + this.data.name + '.ts'
  }

  getDefaultSchemaFilePath() {
    return '/packages/app/bundles/custom/objects/' + this.data.name + '.ts'
  }

  protected static _newInstance(data: any, session?: SessionDataType): ObjectModel {
    return new ObjectModel(data, session);
  }
}
