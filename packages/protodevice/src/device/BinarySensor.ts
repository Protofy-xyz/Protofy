class BinarySensor {
    name;
    platform;
    type;
    constructor(name, platform) {
        this.name = name
        this.platform = platform
        this.type = "binary_sensor"
    }

    attach(pin, deviceComponents) {
        const componentObjects = [
            {
                name: this.type,
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
            name: this.name,
            type: this.type,
            monitors:[
                {
                    name: "Button status",
                    description: "Get binary sensor status",
                    endpoint: "/binary_sensor/"+this.name+"/state",
                    connectionType: "mqtt",
                }
            ]
        }
    }
}

export default function binarySensor(name) { 
    return new BinarySensor(name, 'gpio')
}