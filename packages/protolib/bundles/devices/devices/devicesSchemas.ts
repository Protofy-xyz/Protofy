import { ProtoModel, SessionDataType, API, Schema, z } from '../../../base'
import path from 'path'

export const DevicesSchema = Schema.object({
  name: z.string().hint("Device name").static().regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").id().search(),
  deviceDefinition: z.string().hidden(),
  substitutions: z.record(z.string().optional(), z.any().optional()).optional().hidden(),
  subsystem: z.record(z.string(), z.any()).optional().hidden(),
  data: z.array(z.record(z.string(), z.any())).optional().hidden(),
  currentSdk: z.string().hidden().generate("esphome"),
  environment: z.string().optional().help("The environment the device has access to").hidden().groupIndex("env"),
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

  getEnvironment() {
    return this.data.environment ?? 'dev'
  }

  hasEnvironment(env: string) {
    return (!this.data.environment && env == 'dev') || this.data.environment == env
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

  async getYaml(env: string){
    let yaml = undefined
    try {
      const response = await API.get('/adminapi/v1/deviceDefinitions/' + this.data.deviceDefinition);
      if (response.isError) {
        console.log(response.error)
        return;
      }
      const deviceDefinition = response.data
      const response1 = await API.get('/adminapi/v1/deviceBoards/' + deviceDefinition.board);
        if (response1.isError) {
          console.log(response1.error)
          return;
        }
      console.log("---------deviceDefinition----------", deviceDefinition)
      deviceDefinition.board = response1.data
      const jsCode = deviceDefinition.config.components;
      window['deviceCompileVars'] = {
        env
      }

      const deviceCode = 'device(' + jsCode.replace(/;/g, "") + ')';
      console.log("-------DEVICE CODE------------", deviceCode)
      const deviceObj = eval(deviceCode)
      const componentsTree = deviceObj.getComponentsTree(this.data.name, deviceDefinition)
      yaml = deviceObj.dump("yaml").replace(/'@/g,"").replace(/@'/g,"")

      const subsystems = deviceObj.getSubsystemsTree(this.data.name, deviceDefinition)
      const deviceObject = await API.get("/adminapi/v1/devices/" + this.data.name)
      await API.post("/adminapi/v1/devices/" + this.data.name + "/yamls", { yaml })
      if (deviceObject.isError) {
        console.error(deviceObject.error)
        return;
      }
      deviceObject.data.subsystem = subsystems
      deviceObject.data.environment = env
      
      API.post("/adminapi/v1/devices/" + this.data.name, deviceObject.data)
      console.log("ComponentsTree: ", componentsTree)
      console.log("Subsystems: ", subsystems)
    } catch (error) {
      console.log("Cant get device, error: ", error)
    }
    return yaml
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


  list(search?, session?, extraData?, params?): any {
    if(params && params.filter && params.filter.environment) {
        const {environment, ...filter} = params.filter
        if(!this.hasEnvironment(environment)) { 
            return
        }
        params = {
            ...params,
            filter: {
                ...filter,
            }
        }
    }

    return super.list(search, session, extraData, params)
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
