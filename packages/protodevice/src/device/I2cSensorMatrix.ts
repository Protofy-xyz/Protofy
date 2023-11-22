class I2cSensorMatrix {
    name;
    sclPin;
    updateInterval;
    i2cBusId;
    mqttTopicPrefix;
    bh1750Address;
    hm3301Address;
    sen0377Address;
    mpu6050Address;
    constructor(name, sclPin, updateInterval, i2cBusId, bh1750Address, hm3301Address, sen0377Address, mpu6050Address) {
        this.name = name
        this.sclPin = sclPin
        this.updateInterval = updateInterval
        this.i2cBusId = i2cBusId
        this.mqttTopicPrefix = ''
        this.bh1750Address = bh1750Address
        this.hm3301Address = hm3301Address
        this.sen0377Address = sen0377Address
        this.mpu6050Address = mpu6050Address
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
`    - platform: bh1750
      id: ${this.name}bh1750
      name: ${this.name}bh1750
      address: ${this.bh1750Address}
      update_interval: ${this.updateInterval}
`
            },
            {
                componentName: `sensor`,
                payload: 
`    - platform: hm3301 
      id: ${this.name}hm3301
      address: ${this.hm3301Address}
      update_interval: ${this.updateInterval}
      pm_1_0:
        name: "${this.name}-hm3301-pm1-0"
      pm_2_5:
        name: "${this.name}-hm3301-pm2-5"
      pm_10_0:
        name: "${this.name}-hm3301-pm10-0"
      aqi:
        name: "${this.name}-hm3301-aqi"
        calculation_type: "CAQI"
`
            },
            {
                componentName: `sensor`,
                payload: 
`    - platform: mics_4514 
      id: ${this.name}sen0377
      address: ${this.sen0377Address}
      update_interval: ${this.updateInterval}
      nitrogen_dioxide:
        name: ${this.name}-sen0377-nitrogen-dioxide
      carbon_monoxide:
        name: ${this.name}-sen0377-carbon-monoxide
      hydrogen:
        name: ${this.name}-sen0377-hydrogen
      ethanol:
        name: ${this.name}-sen0377-ethanol
      methane:
        name: ${this.name}-sen0377-methane
      ammonia:
        name: ${this.name}-sen0377-ammonia
`
            },
            ,
            {
                componentName: `sensor`,
                payload: 
`    - platform: mpu6050
      id: ${this.name}mpu6050
      address: ${this.mpu6050Address}
      update_interval: ${this.updateInterval}
      accel_x:
        name: "${this.name}-mpu6050-accel-x"
      accel_y:
        name: "${this.name}-mpu6050-accel-y"
      accel_z:
        name: "${this.name}-mpu6050-accel-z"
      gyro_x:
        name: "${this.name}-mpu6050-gyro-x"
      gyro_y:
        name: "${this.name}-mpu6050-gyro-y"
      gyro_z:
        name: "${this.name}-mpu6050-gyro-z"
      temperature:
        name: "${this.name}-mpu6050-temperature"
`
            }
        ];
    }
}


export default function i2cSensorMatrix(name, sclPin, updateInterval, bh1750Address, hm3301Address, sen0377Address, mpu6050Address) {
    return new I2cSensorMatrix(name, sclPin, updateInterval, "bus_a", bh1750Address, hm3301Address, sen0377Address, mpu6050Address)
}