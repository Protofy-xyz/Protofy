class BinarySensor {
    name;
    platform
    constructor(name, platform) {
        this.name = name
        this.platform = platform
    }

    attach(pin) {
        return [
            {
                name: "binary_sensor",
                config: {
                    platform: this.platform,
                    pin: pin,
                    name: this.name,
                    id: this.name,
                    filters: [
                        { invert: null },
                        { delayed_off: "100ms" },
                        { delayed_on: "100ms" }
                    ]
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

export default function binarySensor(name) { 
    return new BinarySensor(name, 'gpio')
}