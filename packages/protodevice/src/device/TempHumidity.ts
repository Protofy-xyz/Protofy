class TempHumidity {
    name;
    platform;
    model;
    updateInterval;
    type;
    constructor(name, platform, model, updateInterval) {
        this.name = name
        this.platform = platform
        this.type = "sensor"
        this.model = model
        this.updateInterval = updateInterval

    }

    attach(pin, deviceComponents) {

        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    pin: pin,
                    model: this.model,
                    id: this.name,
                    update_interval: this.updateInterval,
                    temperature: { name: this.name+"-temperature" },
                    humidity: { name: this.name+"-humidity" }
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
        return deviceComponents;
    }

    getSubsystem() {
        return {
            name: this.name,
            type: this.type,
            monitors: [
                {
                    name: "temperature",
                    label: "Temperature",
                    description: "Get sensor status",
                    endpoint: "/" + this.type + "/" + this.name + '-temperature' + "/state",
                    connectionType: "mqtt",
                },
                {
                    name: "humidity",
                    label: "Humidity",
                    description: "Get sensor status",
                    endpoint: "/" + this.type + "/" + this.name + '-humidity' + "/state",
                    connectionType: "mqtt",
                }
            ]

        }
    }
}


export function tempHumidity(name, model, updateInterval) {
    return new TempHumidity(name, 'dht', model, updateInterval);
}
