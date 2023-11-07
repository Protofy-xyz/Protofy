class ADCSensor {
    name;
    platform;
    updateInterval;
    attenuation;
    constructor(name, platform,updateInterval, attenuation) {
        this.name = name
        this.platform = platform
        this.updateInterval = updateInterval
        this.attenuation = attenuation? attenuation:"auto"
    }

    attach(pin) {
        return [
            {
                name: "sensor",
                config: {
                    platform: this.platform,
                    pin: pin,
                    name: this.name,
                    id: this.name,
                    update_interval: this.updateInterval,
                    attenuation: this.attenuation
                },
                subsystem:{ //de aqui podemos derivar todas las posibles acciones que permite este componente
                    monitors:[
                        {
                            name: "Get status",
                            description: "Get sensor status",
                            endpoint: "/state",
                            connectionType: "mqtt",
                        }
                    ]
                }
                
            },
        ]
    }
}

export default function adcSensor(name,updateInterval,attenuation) { 
    return new ADCSensor(name, 'adc',updateInterval, attenuation);
}