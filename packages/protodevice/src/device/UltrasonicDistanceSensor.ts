class UltrasonicDistanceSensor {
    type
    name
    platform
    echoPin
    updateInterval
    constructor(name, platform, echoPin, updateInterval) {
        this.type = 'sensor'
        this.name = name
        this.platform = platform
        this.echoPin = echoPin
        this.updateInterval = updateInterval
    }
    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    name: this.name,
                    id: this.name,
                    trigger_pin: pin,
                    echo_pin: this.echoPin,
                    update_interval: this.updateInterval,
                },
                subsystem: this.getSubsystem(),
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
                    name: 'distance',
                    label: 'Distance',
                    description: 'Get distance from sensor',
                    units: 'm',
                    endpoint: '/sensor/' + this.name + '/state',
                    connectionType: 'mqtt',
                }
            ],
        }
    }
}

export function ultrasonicDistanceSensor(name, echoPin, updateInterval) {
    return new UltrasonicDistanceSensor(name, 'ultrasonic', echoPin, updateInterval)
}
