import { ProtoModel, SessionDataType, API, Schema, z } from 'protobase'

export const ArduinosSchema = Schema.object({
  name: z.string().hint("Device name").static().regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").id().search().label("Name"),
  subsystem: z.record(z.string(), z.any()).optional().hidden(),
})
export type ArduinosType = z.infer<typeof ArduinosSchema>;


export class ArduinosModel extends ProtoModel<ArduinosModel> {
  constructor(data: ArduinosType, session?: SessionDataType, ) {
      super(data, ArduinosSchema, session, "Test");
  }
  create(data?):ArduinosModel {
      const result = super.create(data)
      return result
  }

  read(extraData?): ArduinosType {
      const result = super.read(extraData)
      return result
  }

  update(updatedModel: ArduinosModel, data?: ArduinosType): ArduinosModel {
      const result = super.update(updatedModel, data)
      return result
  }

  delete(data?): ArduinosModel {
      const result = super.delete(data)
      return result
  }

  protected static _newInstance(data: any, session?: SessionDataType): ArduinosModel {
      return new ArduinosModel(data, session);
  }

  static load(data: any, session?: SessionDataType): ArduinosModel {
    return this._newInstance(data, session);
  }
}
