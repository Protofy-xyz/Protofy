class ADCSensor {
    name;
    platform;
    updateInterval;
    attenuation;
    type;
    constructor(name, platform,updateInterval, attenuation) {
        this.name = name
        this.platform = platform
        this.type = "sensor"
        this.updateInterval = updateInterval
        this.attenuation = attenuation? attenuation:"auto"
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
                    update_interval: this.updateInterval,
                    attenuation: this.attenuation
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
            monitors:[
                {
                    name: "Get status",
                    description: "Get sensor status",
                    endpoint: "/"+this.type+"/"+this.name+"/state",
                    connectionType: "mqtt",
                }
            ]
        }
    }
}

export default function adcSensor(name,updateInterval,attenuation) { 
    return new ADCSensor(name, 'adc',updateInterval, attenuation);
}