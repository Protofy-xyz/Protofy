class MHZ19 {
  type;
  name;
  platform;
  uartBusId;
  updateInterval;
  mqttTopicPrefix;

  constructor(name, platform, uartBusId, updateInterval) {
    this.type = 'sensor'
    this.name = name
    this.platform = platform
    this.uartBusId = uartBusId
    this.updateInterval = updateInterval
    this.mqttTopicPrefix = ''
  }
  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: this.type,
        config: {
          platform: this.platform,
          id: this.name,
          uart_id: this.uartBusId,
          update_interval: this.updateInterval,
          co2: {name: `${this.name}-co2`},
          temperature: {name: `${this.name}-temperature`},
        },
        subsystem: this.getSubsystem()
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
  getSubsystem() {
    return {
      name: this.name,
      type: this.type,
      monitors: [
        {
          name: 'CO_2',
          description: 'Get CO_2 status',
          units: 'ppm',
          endpoint: "/"+this.type+"/"+this.name+"-co2/state",
          connectionType: 'mqtt',
        },
        {
          name: 'CO_2-temp',
          description: 'Get CO_2 status',
          units: 'ºC',
          endpoint: "/"+this.type+"/"+this.name+"-temperature/state",
          connectionType: 'mqtt',
        },
      ]
    }
  }
}

export default function mhz19(name, uartBusName, updateInterval) { 
    return new MHZ19(name, 'mhz19', uartBusName, updateInterval);
}