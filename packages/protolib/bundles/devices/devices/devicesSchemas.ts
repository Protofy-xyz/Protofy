import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel, ProtoModel, SessionDataType } from 'protolib/base'
import path from 'path'

export const DevicesSchema = Schema.object({
  name: z.string().hint("Device name").static().regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").id().search(),
  deviceDefinition: z.string().hidden(),
  substitutions: z.record(z.string().optional(), z.any().optional()).optional().hidden(),
  subsystem: z.record(z.string(), z.any()).optional().hidden(),
  data: z.array(z.record(z.string(), z.any())).optional().hidden(),
  currentSdk: z.string().hidden().generate("esphome"),
  location: z.object({
    lat: z.string(),
    long: z.string()
  }).optional().location("lat", "long").hidden().generate(()=>{return {lat: "41.3947846",long: "2.1939663"}},true) // PROTOFY HQ
})
export type DevicesType = z.infer<typeof DevicesSchema>;
// export const DevicesModel = AutoModel.createDerived<DevicesType>("DevicesModel", DevicesSchema);

export class DeviceSubsystemAction {
  data: any
  device: string
  subsystem: string
  constructor(device, subsystem, data) {
    this.data = data
    this.device = device
    this.subsystem = subsystem
  }

  getEndpoint() {
    return getPeripheralTopic(this.device, this.data.endpoint)
  }

  getValue() {
    return this.data.payload.value
  }
}

export class DeviceSubsystemMonitor{
  data: any
  device: string
  subsystem: string
  constructor(device, subsystem, data) {
    this.data = data
    this.device = device
    this.subsystem = subsystem
  }

  getEndpoint() {
    return getPeripheralTopic(this.device, this.data.endpoint)
  }

  getEventPath() {
    return this.getEndpoint().split('/').slice(2).join('/')
  }

  getLabel() {
    return this.data.label ?? this.data.name
  }
  
  getUnits() {
    return this.data.units ? this.data.units : ''
  }

  getValueAPIURL() {
    return "/adminapi/v1/devices/"+this.device+"/subsystems/"+this.subsystem+"/monitors/"+this.data.name
  }
}

export class DeviceSubsystem {
  data: any
  device: string
  constructor(device, data) {
    this.data = data
    this.device = device
  }

  getAction(name: string) {
    if(!this.data || !this.data.actions) {
      return
    }

    const actionData = this.data.actions.find(a => a.name == name)
    if(actionData) {
      return new DeviceSubsystemAction(this.device, name, actionData)
    }
  }
  getMonitor(name: string) {
    if(!this.data || !this.data.monitors) {
      return
    }

    const monitorData = this.data.monitors.find(a => a.name == name)
    if(monitorData) {
      return new DeviceSubsystemMonitor(this.device, name, monitorData)
    }
  }
}
export class DevicesModel extends ProtoModel<DevicesModel> {
  constructor(data: DevicesType, session?: SessionDataType, ) {
      super(data, DevicesSchema, session, "Test");
  }

  public static getApiOptions() {
      return {
          name: 'devices',
          prefix: '/api/v1/'
      }
  }

  isInitialized(){
    return this.data?.subsystem? true: false
  }

  getConfigDir(){
    return 'data/devices/'+this.data?.name;
  }

  getConfigFile(){
    if(this.data?.currentSdk == "esphome"){
      return path.join(this.getConfigDir(),"config.yaml")
    }
  }
  getSubsystem(name: string) {
    if(!this.data || !this.data.subsystem) {
      return
    }
    const subsystemData = this.data.subsystem.find(s => s.name == name)
    if(subsystemData) {
      return new DeviceSubsystem(this.data.name, subsystemData)
    }
  }

  create(data?):DevicesModel {
      const result = super.create(data)
      return result
  }

  read(extraData?): DevicesType {
      const result = super.read(extraData)
      return result
  }

  update(updatedModel: DevicesModel, data?: DevicesType): DevicesModel {
      const result = super.update(updatedModel, data)
      return result
  }

  list(search?, session?, extraData?, params?): DevicesType[] {
      const result = super.list(search, session, extraData, params)
      return result
  }

  delete(data?): DevicesModel {
      const result = super.delete(data)
      return result
  }

  protected static _newInstance(data: any, session?: SessionDataType): DevicesModel {
      return new DevicesModel(data, session);
  }

  static load(data: any, session?: SessionDataType): DevicesModel {
    return this._newInstance(data, session);
  }
}

export const getPeripheralTopic = (deviceName: string, endpoint: string = '') => {
  return "devices/" + deviceName + endpoint
}
