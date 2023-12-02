import { z } from "protolib/base";
import { BaseSchema } from 'protolib/base'
import { AutoModel } from 'protolib/base'
import { ProtoModel } from "../../base";
import { SessionDataType } from "../../api";

export const BaseObjectSchema = z.object({
  id: z.string().search().id().generate((obj) => obj.name.charAt(0).toUpperCase() + obj.name.slice(1) + 'Model').hidden(),
  name: z.string().search().static(),
  features: z.any().generate({}, true).hidden(),
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
    .generate({})
  // data: z.string().search(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
  //from: z.string().search(), // system entity where the event was generated (next, api, cmd...)
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

  getDefaultSchemaFilePath() {
    return ObjectModel.getDefaultSchemaFilePath(this.data.name)
  }

  static getDefaultSchemaFilePath(name) {
    return '/packages/app/bundles/custom/objects/' + name + '.ts'
  }

  create(data?) {
    const _data = data ?? this.getData()

    //if no type is specified, use string
    const obj = {
      ..._data,
      keys: Object.keys(_data.keys ? _data.keys : {}).reduce((total, k) => {
        return {
          ...total,
          [k]: {
            type: "string",
            ..._data.keys[k],
          }
        }
      }, {})
    }
    return super.create(obj)
  }

  protected static _newInstance(data: any, session?: SessionDataType): ObjectModel {
    return new ObjectModel(data, session);
  }
}
