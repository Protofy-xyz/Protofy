class ModbusLoadCell {
    name;
    platform;
    rxPin;
    enablePin
    updateInterval;
    weightRegister;
    weightRegisters2Read;
    stateFlagsRegister;
    mqttTopicPrefix;
    dpEnabled;

    constructor(name, platform, rxPin, enablePin, updateInterval, weightRegister, weightRegisters2Read, stateFlagsRegister) {
        this.name = name
        this.platform = platform
        this.rxPin = rxPin
        this.enablePin = enablePin
        this.updateInterval = updateInterval
        this.weightRegister = weightRegister
        this.weightRegisters2Read = weightRegisters2Read
        this.stateFlagsRegister = stateFlagsRegister
        this.mqttTopicPrefix = ''
        this.dpEnabled = false
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }
    setDeepSleep(dpEnabled){
        this.dpEnabled = dpEnabled;
    }

    attach(pin) {
        var components = [
            {
                name: "uart",
                config: {
                    id: `${this.name}uartmodbus`,
                    tx_pin: pin,
                    rx_pin: this.rxPin,
                    baud_rate: 19200,
                    stop_bits: 2
                }
            },
            {
                name: this.platform,
                config: {
                    id: `${this.name}modbusid`,
                    uart_id: `${this.name}uartmodbus`
                }
            },
            {
                name: "modbus_controller",
                config: {
                    id: `${this.name}modbuscontrollerid`,
                    address: 0x1,
                    modbus_id: `${this.name}modbusid`,
                    setup_priority: -10,
                    update_interval: this.updateInterval
                }
            },
            {
                name: "sensor",
                config: {
                    platform: "modbus_controller",
                    modbus_controller_id: `${this.name}modbuscontrollerid`,
                    id: `${this.name}load`,
                    name: `${this.name}load`,
                    unit_of_measurement: "Kg",
                    address: parseInt(this.weightRegister),
                    register_type: "holding",
                    value_type: this.weightRegisters2Read == 2 ? 'U_DWORD' : 'U_WORD',
                    register_count: parseInt(this.weightRegisters2Read)
                }
            },
            {
                name: "binary_sensor",
                config: {
                    platform: "modbus_controller",
                    modbus_controller_id: `${this.name}modbuscontrollerid`,
                    id: `${this.name}stateflags0`,
                    name: `${this.name}stateflags0`,
                    address: parseInt(this.stateFlagsRegister),
                    register_type: "holding",
                    bitmask: 0x0
                }
            },
            {
                name: "binary_sensor",
                config: {
                    platform: "modbus_controller",
                    modbus_controller_id: `${this.name}modbuscontrollerid`,
                    id: `${this.name}stateflags3`,
                    name: `${this.name}stateflags3`,
                    address: parseInt(this.stateFlagsRegister),
                    register_type: "holding",
                    bitmask: 0x3
                }
            },
            {
                name: "binary_sensor",
                config: {
                    platform: "modbus_controller",
                    modbus_controller_id: `${this.name}modbuscontrollerid`,
                    id: `${this.name}stateflags4`,
                    name: `${this.name}stateflags4`,
                    address: parseInt(this.stateFlagsRegister),
                    register_type: "holding",
                    bitmask: 0x10
                }
            }
        ]
        const dsComponents = [
            {
                name: "switch",
                config: {
                    platform: "gpio",
                    pin: this.enablePin,
                    id: `${this.name}enablepin`,
                    name: `${this.name}enablepin`
                }
            },
            {
                name: "on_boot",
                config: {
                    priority: 100,
                    then: [
                        { "switch.turn_on": `${this.name}enablepin`},
                        { wait_until:{
                            condition: {
                                "mqtt.connected": null
                            }
                        }},
                        { "component.update": `${this.name}modbuscontrollerid`},
                        { delay: "1s"},
                        { "deep_sleep.enter": "ds"}
                    ]
                }
            },
            {
                name: "on_shutdown",
                config: {
                    priority: 700,
                    then: [
                        { "switch.turn_off": `${this.name}enablepin`},
                    ]
                }
            }
        ]
        if(this.dpEnabled) components =  components.concat(dsComponents)
        return components
    }
}
export default function modbusLoadCell(name, rxPin, enablePin, updateInterval, weightRegister, weightRegisters2Read, stateFlagsRegister) { 
    return new ModbusLoadCell(name, 'modbus', rxPin, enablePin, updateInterval, weightRegister, weightRegisters2Read, stateFlagsRegister);
}