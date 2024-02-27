class SEN55 {
  type;
  name;
  platform;
  address;
  updateInterval;
  i2cBusId;
  sclPin;
  constructor(name, platform, i2cBusId, address, updateInterval) {
    this.type = "sensor"
    this.name = name
    this.platform = platform
    this.address = address
    this.updateInterval = updateInterval
    this.i2cBusId = i2cBusId
  }
  attach(pin, deviceComponents) {
    const componentObjects = [
      {
        name: this.type,
        config: {
          platform: this.platform,
          id: this.name,
          address: this.address,
          update_interval: this.updateInterval,
          pm_1_0: {name: `${this.name}-pm1-0`},
          pm_2_5: {name: `${this.name}-pm2-5`},
          pm_4_0: {name: `${this.name}-pm4-0`},
          pm_10_0: {name: `${this.name}-pm10-0`},
          temperature: {name: `${this.name}-temperature`},
          humidity: {name: `${this.name}-humidity`},
          nox: {name: `${this.name}-nox`},
          voc: {name: `${this.name}-voc`},
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
          name: 'Pm1.0',
          description: 'Get pm1.0 status',
          units: 'µg/m³',
          endpoint: "/sensor/"+this.name+"-pm1-0/state",
          connectionType: 'mqtt',
        },
        {
          name: 'Pm2.5',
          description: 'Get pm2.5 status',
          units: 'µg/m³',
          endpoint: "/sensor/"+this.name+"-pm2-5/state",
          connectionType: 'mqtt',
        },
        {
          name: 'Pm4.0',
          description: 'Get pm4.0 status',
          units: 'µg/m³',
          endpoint: "/sensor/"+this.name+"-pm4-0/state",
          connectionType: 'mqtt',
        },
        {
          name: 'Pm10.0',
          description: 'Get pm10.0 status',
          units: 'µg/m³',
          endpoint: "/sensor/"+this.name+"-pm10-0/state",
          connectionType: 'mqtt',
        },
        {
          name: 'Temperature',
          description: 'Get temperature status',
          units: 'ºC',
          endpoint: "/sensor/"+this.name+"-temperature/state",
          connectionType: 'mqtt',
        },
        {
          name: 'Humidity',
          description: 'Get humidity status',
          units: '%',
          endpoint: "/sensor/"+this.name+"-humidity/state",
          connectionType: 'mqtt',
        },
        {
          name: 'NOx',
          description: 'Get NOX status',
          endpoint: "/sensor/"+this.name+"-nox/state",
          connectionType: 'mqtt',
        },
        {
          name: 'VOC',
          description: 'Get VOC status',
          endpoint: "/sensor/"+this.name+"-voc/state",
          connectionType: 'mqtt',
        }
      ]
    }
  }
}


export default function sen55(name, i2cBusId, address, updateInterval) {
    return new SEN55(name, 'sen5x', i2cBusId, address, updateInterval)
}