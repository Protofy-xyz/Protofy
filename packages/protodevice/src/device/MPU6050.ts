class MPU6050 {
  type;
  name;
  platform;
  address;
  updateInterval;
  i2cBusId;
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
          accel_x: {name: `${this.name}_accel_x`},
          accel_y: {name: `${this.name}_accel_y`},
          accel_z: {name: `${this.name}_accel_z`},
          gyro_x: {name: `${this.name}_gyro_x`},
          gyro_y: {name: `${this.name}_gyro_y`},
          gyro_z: {name: `${this.name}_gyro_z`},
          temperature: {name: `${this.name}_temperature`},
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
          name: 'accel_x',
          label: 'Accelerometer X',
          description: 'Get accelerometer X axis status',
          units: 'm/s²',
          endpoint: "/sensor/"+this.name+"_accel_x/state",
          connectionType: 'mqtt',
        },
        {
          name: 'accel_y',
          label: 'Accelerometer Y',
          description: 'Get accelerometer Y axis status',
          units: 'm/s²',
          endpoint: "/sensor/"+this.name+"_accel_y/state",
          connectionType: 'mqtt',
        },
        {
          name: 'accel_z',
          label: 'Accelerometer Z',
          description: 'Get accelerometer Z axis status',
          units: 'm/s²',
          endpoint: "/sensor/"+this.name+"_accel_z/state",
          connectionType: 'mqtt',
        },
        {
          name: 'gyro_x',
          label: 'Gyroscope X',
          description: 'Get gyroscope X axis status',
          units: '°/s',
          endpoint: "/sensor/"+this.name+"_gyro_x/state",
          connectionType: 'mqtt',
        },
        {
          name: 'gyro_y',
          label: 'Gyroscope Y',
          description: 'Get gyroscope Y axis status',
          units: '°/s',
          endpoint: "/sensor/"+this.name+"_gyro_y/state",
          connectionType: 'mqtt',
        },
        {
          name: 'gyro_z',
          label: 'Gyroscope Z',
          description: 'Get gyroscope Z axis status',
          units: '°/s',
          endpoint: "/sensor/"+this.name+"_gyro_z/state",
          connectionType: 'mqtt',
        },
        {
          name: 'temperature',
          label: 'Temperature',
          description: 'Get temperature status',
          units: '°C',
          endpoint: "/sensor/"+this.name+"_temperature/state",
          connectionType: 'mqtt',
        },
      ]
    }
  }
}


export function mpu6050(name, i2cBusId, address, updateInterval) {
    return new MPU6050(name, 'mpu6050', i2cBusId, address, updateInterval)
}