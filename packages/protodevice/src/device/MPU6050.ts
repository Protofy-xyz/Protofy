class MPU6050 {
    name;
    platform;
    address;
    updateInterval;
    i2cBusId;
    sclPin;
    mqttTopicPrefix;
    constructor(name, platform, address, updateInterval, i2cBusId, sclPin) {
        this.name = name
        this.platform = platform
        this.address = address
        this.updateInterval = updateInterval
        this.i2cBusId = i2cBusId
        this.sclPin = sclPin
        this.mqttTopicPrefix = ''
    }

    getPlatform() {
        return this.platform;
    }

    setMqttTopicPrefix(setMqttTopicPrefix) {
        this.mqttTopicPrefix = setMqttTopicPrefix;
    }

    attach(pin) {
        return [
            {
                componentName: "i2c",
                payload: `    sda: ${pin}
    scl: ${this.sclPin}
    #scan: true
    id: ${this.i2cBusId}
`
            },
            {
                componentName: `sensor`,
                payload: 
`    - platform: mpu6050
      id: ${this.name}
      address: ${this.address}
      update_interval: ${this.updateInterval}
      accel_x:
        name: "${this.name}-accel-x"
      accel_y:
        name: "${this.name}-accel-y"
      accel_z:
        name: "${this.name}-accel-z"
      gyro_x:
        name: "${this.name}-gyro-x"
      gyro_y:
        name: "${this.name}-gyro-y"
      gyro_z:
        name: "${this.name}-gyro-z"
      temperature:
        name: "${this.name}-temperature"
`
            }
        ];
    }
}


export default function mpu6050(name, sclPin, address, updateInterval) {
    return new MPU6050(name, 'mpu6050', address, updateInterval, "bus_a", sclPin)
}