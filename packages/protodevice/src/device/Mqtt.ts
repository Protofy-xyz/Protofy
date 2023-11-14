class Mqtt {
  broker
  topic_prefix
  constructor(broker, topic_prefix) {
    this.broker = broker
    this.topic_prefix = topic_prefix
  }
  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: 'mqtt',
        config: {
          broker: this.broker,
          topic_prefix: deviceComponents.esphome.name,
        },
      },
    ]

    componentObjects.forEach((element, j) => {
        if (!deviceComponents[element.name]) {
            deviceComponents[element.name] = element.config
        } else {
            if (!Array.isArray(deviceComponents[element.name])) {
                deviceComponents[element.name] = [deviceComponents[element.name]]
            }
            deviceComponents[element.name] = [...deviceComponents[element.name], element.config]
        }
    })
    return deviceComponents
  }
}

export default function mqtt(broker, topic_prefix) {
  return new Mqtt(broker, topic_prefix)
}
