class Mqtt {
  broker
  topic_prefix
  name
  type
  env
  port
  constructor(broker, env) {
    this.broker = broker
    this.name = this.type = 'mqtt'
    this.env = env
    this.port = env == 'dev' ? 1883 : 8883
  }
  attach(pin, deviceComponents) {
    this.topic_prefix = "devices/" + deviceComponents.esphome.name //Should have same shape as getPeripheralTopic() in deviceSchema.ts

    const componentObjects = [
      {
        name: this.type,
        config: {
          broker: this.broker,
          port: this.port,
          topic_prefix: this.topic_prefix
        },
        subsystem: this.getSubsystem()
      }
    ]

    componentObjects.forEach((element, j) => {
        if (!deviceComponents[element.name]) {
            deviceComponents[element.name] = element.config
        } else {
          deviceComponents[element.name] = {...deviceComponents[element.name], ...element.config}
        }
    })
    return deviceComponents
  }
  getSubsystem() {
    return {
      name: this.name,
      type: this.type,
      config:{
        prefix: this.topic_prefix,
        frontendEndpoint: "/ws", //TODO que vingui de la mask
        brokerUrl: this.broker,
      },
      actions: [],
      monitors: [
        {
          name: 'status',
          label: 'Device status',
          description: 'Gets the status of the mqtt connection',
          endpoint: '/status',
          connectionType: 'mqtt',
        },
      ],
    }
  }
}

export function mqtt(broker) {
  const compileVars = window['deviceCompileVars'] || {}
  return new Mqtt(broker, compileVars.env ?? 'dev')
}
