class BinarySensor {
    name;
    platform
    constructor(name, platform) {
        this.name = name
        this.platform = platform
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: "binary_sensor",
                config: {
                    platform: this.platform,
                    pin: pin,
                    name: this.name,
                    id: this.name,
                    filters: [
                        { delayed_off: "100ms" },
                        { delayed_on: "100ms" }
                    ]
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
            monitors:[
                {
                    name: "Button status",
                    description: "Get binary sensor status",
                    endpoint: "/state",
                    connectionType: "mqtt",
                }
            ]
        }
    }
}

export default function binarySensor(name) { 
    return new BinarySensor(name, 'gpio')
}