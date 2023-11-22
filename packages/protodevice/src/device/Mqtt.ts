class Mqtt {
  broker
  topic_prefix
  name
  type
  constructor(broker, topic_prefix) {
    this.broker = broker
    this.topic_prefix = topic_prefix
    this.name = this.type = 'mqtt'
  }
  attach(pin, deviceComponents) {
    this.topic_prefix = deviceComponents.esphome.name
    const componentObjects = [
      {
        name: this.type,
        config: {
          broker: this.broker,
          topic_prefix: this.topic_prefix,
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
          name: 'Device status',
          description: 'Gets the status of the mqtt connection',
          endpoint: '/status',
          connectionType: 'mqtt',
        },
      ],
    }
  }
}

export default function mqtt(broker, topic_prefix) {
  return new Mqtt(broker, topic_prefix)
}
