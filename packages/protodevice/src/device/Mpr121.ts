class Mpr121 {
    name;
    platform;
    i2cBusId;
    sclPin;
    mqttTopicPrefix;
    channels = [];
    constructor(name, platform, i2cBusId, sclPin, channel0, channel1, channel2, channel3, channel4, chanel5, channel6, chanel7, channel8, chanel9, channel10, chanel11) {
        this.name = name
        this.platform = platform
        this.i2cBusId = i2cBusId
        this.sclPin = sclPin
        this.mqttTopicPrefix = ''
        this.channels = [channel0, channel1, channel2, channel3, channel4, chanel5, channel6, chanel7, channel8, chanel9, channel10, chanel11]
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
`,
            },
            {
                componentName: `${this.platform}`,
                payload: `    id: ${this.name}
    address: 0x5A
    touch_debounce: 1
    release_debounce: 1
    touch_threshold: 10
    release_threshold: 7
`,
            },
            ...this.channels
                .map((number,i) => {
                    return number
                        ? {
                            componentName: `binary_sensor`,
                            payload: `    - platform: mpr121
      id: ${this.name + "_" + i}
      channel: ${i}
      name:  ${this.name + "_" + i}
      touch_threshold: 12
      release_threshold: 6
`,
                        }
                        : null;
                })
                .filter(Boolean) 
        ];
    }
}


export default function mpr121(name, sclPin, channel0, channel1, channel2, chanel3, channel4, chanel5, channel6, chanel7, channel8, chanel9, channel10, chanel11) {
    return new Mpr121(name, 'mpr121', "bus_a", sclPin, channel0, channel1, channel2, chanel3, channel4, chanel5, channel6, chanel7, channel8, chanel9, channel10, chanel11)
}