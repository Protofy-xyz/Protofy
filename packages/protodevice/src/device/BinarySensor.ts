export function getSubsystem() {
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
                subsystem: getSubsystem()
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
}

export default function binarySensor(name) { 
    return new BinarySensor(name, 'gpio')
}