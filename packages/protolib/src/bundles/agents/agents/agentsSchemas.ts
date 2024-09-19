import { ProtoModel, SessionDataType, API, Schema, z } from 'protobase'
import path from 'path'

export const AgentsSchema = Schema.object({
  name: z.string().hint("Agent name").static().regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").id().search(),
  agentDefinition: z.string().hidden(),
  substitutions: z.record(z.string().optional(), z.any().optional()).optional().hidden(),
  subsystem: z.record(z.string(), z.any()).optional().hidden(),
  data: z.array(z.record(z.string(), z.any())).optional().hidden(),
  platform: z.string().hidden(),
  environment: z.string().optional().help("The environment the agent has access to").hidden().groupIndex("env"),
  location: z.object({
    lat: z.string(),
    long: z.string()
  }).optional().location("lat", "long").hidden().generate(()=>{return {lat: "41.3947846",long: "2.1939663"}},true) // PROTOFY HQ
})
export type AgentsType = z.infer<typeof AgentsSchema>;
// export const AgentsModel = AutoModel.createDerived<AgentsType>("AgentsModel", AgentsSchema);

export class AgentSubsystemAction {
  data: any
  agent: string
  subsystem: string
  constructor(agent, subsystem, data) {
    this.data = data
    this.agent = agent
    this.subsystem = subsystem
  }

  getEndpoint() {
    return getPeripheralTopic(this.agent, this.data.endpoint)
  }

  getValue() {
    return this.data.payload.value
  }
}

export class AgentSubsystemMonitor{
  data: any
  agent: string
  subsystem: string
  constructor(agent, subsystem, data) {
    this.data = data
    this.agent =agent 
    this.subsystem = subsystem
  }

  getEndpoint() {
    return getPeripheralTopic(this.agent, this.data.endpoint)
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
    return "/adminapi/v1/agents/"+this.agent+"/subsystems/"+this.subsystem+"/monitors/"+this.data.name
  }
}

export class AgentSubsystem {
  data: any
  agent: string
  constructor(agent, data) {
    this.data = data
    this.agent =agent 
  }

  getAction(name: string) {
    if(!this.data || !this.data.actions) {
      return
    }

    const actionData = this.data.actions.find(a => a.name == name)
    if(actionData) {
      return new AgentSubsystemAction(this.agent, name, actionData)
    }
  }
  getMonitor(name: string) {
    if(!this.data || !this.data.monitors) {
      return
    }

    const monitorData = this.data.monitors.find(a => a.name == name)
    if(monitorData) {
      return new AgentSubsystemMonitor(this.agent, name, monitorData)
    }
  }
}
export class AgentsModel extends ProtoModel<AgentsModel> {
  constructor(data: AgentsType, session?: SessionDataType, ) {
      super(data, AgentsSchema, session, "Test");
  }

  getEnvironment() {
    return this.data.environment ?? 'dev'
  }

  hasEnvironment(env: string) {
    return (!this.data.environment && env == 'dev') || this.data.environment == env
  }

  public static getApiOptions() {
      return {
          name: 'agents',
          prefix: '/api/v1/'
      }
  }

  isInitialized(){
    return this.data?.subsystem? true: false
  }

  getConfigDir(){
    return 'data/agents/'+this.data?.name;
  }

  getConfigFile(){
    if(this.data?.currentSdk == "esphome"){
      return path.join(this.getConfigDir(),"config.yaml")
    }
  }

  setMonitorEphemeral(subsystem: string, monitor: string, value: boolean): AgentsModel|undefined{
    const subsystemCandidate = this.getSubsystem(subsystem)
    if(subsystemCandidate){
      const monitorCandidate = subsystemCandidate.getMonitor(monitor)
      if(monitorCandidate){
        this.data.subsystem.find(s => s.name == subsystem).monitors.find(m => m.name == monitor).ephemeral = value
        return new AgentsModel(this.data)
      }
    }
    return undefined
  }

  getMonitorByEndpoint(endpoint: string) {
    if(!this.data || !this.data.subsystem) {
      return null
    }
    let monitor = null
    this.data.subsystem.forEach(subsystem => {
      // console.log("Subsystems - getMonitorByEndpoint: ", subsystem)
      if(subsystem.monitors) {
        const monitorData = subsystem.monitors.find(m => m.endpoint == endpoint)
        // console.log("MonitorData: ", monitorData)
        if(monitorData) {
          monitor =new AgentSubsystemMonitor(this.data.name, subsystem.name, monitorData)
          // console.log("Monitor: ", monitor)
        }
      }
    })
    return monitor
  }

  getSubsystem(name: string) {
    if(!this.data || !this.data.subsystem) {
      return
    }
    const subsystemData = this.data.subsystem.find(s => s.name == name)
    if(subsystemData) {
      return new AgentSubsystem(this.data.name, subsystemData)
    }
  }

  async getYaml(env: string){
    let yaml = undefined
    try {
      const response = await API.get('/adminapi/v1/agentDefinitions/' + this.data.agentDefinition);
      if (response.isError) {
        console.log(response.error)
        return;
      }
      const agentDefinition = response.data
      const response1 = await API.get('/adminapi/v1/agentBoards/' + agentDefinition.board.name);
        if (response1.isError) {
          console.log(response1.error)
          return;
        }
      console.log("---------agentDefinition----------", agentDefinition)
      agentDefinition.board = response1.data
      const jsCode = agentDefinition.config.components;
      window['agentCompileVars'] = {
        env
      }

      const agentCode = 'agent(' + jsCode.replace(/;/g, "") + ')';
      console.log("-------AGENT CODE------------", agentCode)
      const agentObj = eval(agentCode)
      const componentsTree = agentObj.getComponentsTree(this.data.name, agentDefinition)
      yaml = agentObj.dump("yaml").replace(/'@/g,"").replace(/@'/g,"")

      const subsystems = agentObj.getSubsystemsTree(this.data.name, agentDefinition)
      const agentObject = await API.get("/adminapi/v1/agents/" + this.data.name)
      await API.post("/adminapi/v1/agents/" + this.data.name + "/yamls", { yaml })
      if (agentObject.isError) {
        console.error(agentObject.error)
        return;
      }
      // agentObject.data.subsystem = subsystems
      agentObject.data.environment = env
      
      API.post("/adminapi/v1/agents/" + this.data.name, agentObject.data)
      console.log("ComponentsTree: ", componentsTree)
      console.log("Subsystems: ", subsystems)
    } catch (error) {
      console.log("Cant get agent, error: ", error)
    }
    return yaml
  }
  async setSubsystem(){
    const response = await API.get('/adminapi/v1/agentDefinitions/' + this.data.agentDefinition);
    if (response.isError) {
      console.log(response.error)
      return;
    }
    const agentDefinition = response.data
    const jsCode = agentDefinition.config.components;
    const agentCode = 'agent(' + jsCode.replace(/;/g, "") + ')';
    const agentObj = eval(agentCode)
    const subsystems = agentObj.getSubsystemsTree(this.data.name, agentDefinition)
    const agentObject = await API.get("/adminapi/v1/agents/" + this.data.name)
    if (agentObject.isError) {
      console.error(agentObject.error)
      return;
    }
    agentObject.data.subsystem = subsystems
    API.post("/adminapi/v1/agents/" + this.data.name, agentObject.data)
  }
  
  async setUploaded(){
    await this.setSubsystem()
  }


  create(data?):AgentsModel {
      const result = super.create(data)
      return result
  }

  read(extraData?): AgentsType {
      const result = super.read(extraData)
      return result
  }

  update(updatedModel: AgentsModel, data?: AgentsType): AgentsModel {
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

  delete(data?): AgentsModel {
      const result = super.delete(data)
      return result
  }

  protected static _newInstance(data: any, session?: SessionDataType): AgentsModel {
      return new AgentsModel(data, session);
  }

  static load(data: any, session?: SessionDataType): AgentsModel {
    return this._newInstance(data, session);
  }
}

export const getPeripheralTopic = (agentName: string, endpoint: string = '') => {
  return "agents/" + agentName + endpoint
}
