import { extractComponent } from "./utils"


// sensor:
//   - platform: ina226
//     id: "aa"
//     i2c_id: busaa
//     address: 0x40
//     shunt_resistance: 0.1 ohm
//     max_current: 3.2A
//     # adc time used for both, Bus Voltage and Shunt Voltage
//     adc_time: 140us
//     adc_averaging: 128
//     update_interval: 60s
//     current:
//       name: "INA226 Current"
//     power:
//       name: "INA226 Power"
//     bus_voltage:
//       name: "INA226 Bus Voltage"
//     shunt_voltage:
//       name: "INA226 Shunt Voltage"

class INA226 {
    name;
    platform;
    address;
    type;
    i2cId;
    shuntResistance;
    maxCurrent;
    adcTime;
    adcAvg;
    updateInterval;
    constructor(name, platform, address, i2cId,shuntResistance, maxCurrent, adcTime, adcAvg,updateInterval) {
        this.name = name
        this.platform = platform
        this.type = "sensor"
        this.address = address
        this.adcAvg = adcAvg
        this.adcTime = adcTime
        this.i2cId = i2cId
        this.shuntResistance = shuntResistance
        this.maxCurrent = maxCurrent
        this.updateInterval = updateInterval
    }
  
    attach(pin, deviceComponents) {
        
        const componentObjects = [
            {
                name: this.type,
                config: {
                    platform: this.platform,
                    id: this.name,
                    address: this.address,
                    i2c_id: this.i2cId,
                    shunt_resistance: this.shuntResistance,
                    max_current: this.maxCurrent,
                    adc_time: this.adcTime,
                    adc_averaging: this.adcAvg,
                    update_interval: this.updateInterval,
                    current:{
                        name: `${this.name}current`
                    },
                    power:{
                        name: `${this.name}power`
                    },
                    bus_voltage:{
                        name: `${this.name}busvoltage`
                    },
                    shunt_voltage:{
                        name: `${this.name}shuntvoltage`
                    }
                },
                subsystem: this.getSubsystem()
            }
        ]
  
        componentObjects.forEach((element, j) => {
            deviceComponents = extractComponent(element, deviceComponents)
        })

        return deviceComponents;
    }
  
    getSubsystem() {
        return {
            name: this.name,
            type: this.type,
            monitors:[
                {
                    name: "current",
                    label: "Get current",
                    description: "Get current status",
                    units: 'A',
                    endpoint: "/"+this.type+"/"+`${this.name}current`+"/state",
                    connectionType: "mqtt",
                },
                {
                    name: "power",
                    label: "Get power",
                    description: "Get power status",
                    units: 'W',
                    endpoint: "/"+this.type+"/"+`${this.name}power`+"/state",
                    connectionType: "mqtt",
                },
                {
                    name: "busvoltage",
                    label: "Get bus voltage",
                    description: "Get bus voltage status",
                    units: 'V',
                    endpoint: "/"+this.type+"/"+`${this.name}busvoltage`+"/state",
                    connectionType: "mqtt",
                },
                {
                    name: "shuntvoltage",
                    label: "Get shunt voltage",
                    description: "Get shunt voltage status",
                    units: 'V',
                    endpoint: "/"+this.type+"/"+`${this.name}shuntvoltage`+"/state",
                    connectionType: "mqtt",
                }
            ]
        }
    }
  }
  
  export function ina226(name, address,i2cId,shuntResistance,maxCurrent, adcTime,adcAvg,updateInterval) { 
    return new INA226(name, 'ina226',address,i2cId,shuntResistance,maxCurrent, adcTime,adcAvg,updateInterval);
  }