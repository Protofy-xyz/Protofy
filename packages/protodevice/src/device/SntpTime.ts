class SntpTime {
    name;
    type;
    timeZone;

    constructor(name, timeZone) {
        this.name = name;
        this.type = "time";
        this.timeZone = timeZone
    }

    attach(pin, deviceComponents) {

        const componentObjects = [
            {
                name: "time",
                config: {
                    platform: "sntp",
                    id: this.name,
                    timezone: this.timeZone,
                    servers: [
                        "0.pool.ntp.org",
                        "1.pool.ntp.org",
                        "2.pool.ntp.org"
                    ]
                    
                }
            },

        ];

        componentObjects.forEach((element) => {
            if (!deviceComponents[element.name]) {
                deviceComponents[element.name] = element.config;
            } else {
                if (!Array.isArray(deviceComponents[element.name])) {
                    deviceComponents[element.name] = [deviceComponents[element.name]];
                }
                deviceComponents[element.name] = [...deviceComponents[element.name], element.config];
            }
        });

        return deviceComponents;
    }

    getSubsystem() {
        return {}
    }
}

export function sntpTime(name, timeZone) { 
    return new SntpTime(name, timeZone);
}
