class UltrasonicDistanceSensor {
    name;
    platform;
    echoPin;
    updateInterval;
    timeout ;
    constructor(name, platform, echoPin, updateInterval, timeout) {
        this.name = name
        this.platform = platform
        this.echoPin = echoPin
        this.updateInterval = updateInterval
        this.timeout  = timeout 
    }

    attach(pin) {
        return {componentName: 'sensor',payload:
`    - platform: ${this.platform}
      id: ${this.name}
      name: ${this.name}
      trigger_pin: ${pin}
      echo_pin: ${this.echoPin}
      update_interval: ${this.updateInterval}
      timeout : ${this.timeout }
`
    }
    }
}

export default function ultrasonicDistanceSensor(name, echoPin, updateInterval, timeout) { 
    return new UltrasonicDistanceSensor(name, 'ultrasonic', echoPin, updateInterval, timeout);
}