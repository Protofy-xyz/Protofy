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
          accel_x: {name: `${this.name}-accel-x`},
          accel_y: {name: `${this.name}-accel-y`},
          accel_z: {name: `${this.name}-accel-z`},
          gyro_x: {name: `${this.name}-gyro-x`},
          gyro_y: {name: `${this.name}-gyro-y`},
          gyro_z: {name: `${this.name}-gyro-z`},
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
          endpoint: "/sensor/"+this.name+"-accel-x/state",
          connectionType: 'mqtt',
        },
        {
          name: 'accel_y',
          label: 'Accelerometer Y',
          description: 'Get accelerometer Y axis status',
          units: 'm/s²',
          endpoint: "/sensor/"+this.name+"-accel-y/state",
          connectionType: 'mqtt',
        },
        {
          name: 'accel_z',
          label: 'Accelerometer Z',
          description: 'Get accelerometer Z axis status',
          units: 'm/s²',
          endpoint: "/sensor/"+this.name+"-accel-z/state",
          connectionType: 'mqtt',
        },
        {
          name: 'gyro_x',
          label: 'Gyroscope X',
          description: 'Get gyroscope X axis status',
          units: '°/s',
          endpoint: "/sensor/"+this.name+"-gyro-x/state",
          connectionType: 'mqtt',
        },
        {
          name: 'gyro_y',
          label: 'Gyroscope Y',
          description: 'Get gyroscope Y axis status',
          units: '°/s',
          endpoint: "/sensor/"+this.name+"-gyro-y/state",
          connectionType: 'mqtt',
        },
        {
          name: 'gyro_z',
          label: 'Gyroscope Z',
          description: 'Get gyroscope Z axis status',
          units: '°/s',
          endpoint: "/sensor/"+this.name+"-gyro-z/state",
          connectionType: 'mqtt',
        },
      ]
    }
  }
}


export function mpu6050(name, i2cBusId, address, updateInterval) {
    return new MPU6050(name, 'mpu6050', i2cBusId, address, updateInterval)
}