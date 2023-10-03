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
        const components = [
        {componentName: 'uart', payload:
`  id: ${this.name}uartmodbus
  tx_pin: ${pin}
  rx_pin: ${this.rxPin}
  baud_rate: 19200
  stop_bits: 2

` },   {componentName: this.platform, payload:
`  id: ${this.name}modbusid
`},
      {componentName: 'modbus_controller', payload:    
`  - id: ${this.name}modbuscontrollerid
    address: 0x1
    modbus_id: ${this.name}modbusid
    setup_priority: -10
    update_interval: ${this.updateInterval}

` },  
{componentName: 'sensor', payload:    
`  -  platform: modbus_controller
     modbus_controller_id: ${this.name}modbuscontrollerid
     id: ${this.name}load
     name: "${this.name}load"
     unit_of_measurement: "Kg"
     address: ${this.weightRegister}
     register_type: holding
     value_type: ${this.weightRegisters2Read == 2 ? 'U_DWORD' : 'U_WORD'}
     register_count: ${this.weightRegisters2Read}

` },
{componentName: 'binary_sensor', payload:
`  - platform: modbus_controller
    modbus_controller_id: ${this.name}modbuscontrollerid
    id: ${this.name}stateflags0
    name: "${this.name}stateflags0"
    address: ${this.stateFlagsRegister}
    register_type: holding
    bitmask: 0x0
  - platform: modbus_controller
    modbus_controller_id: ${this.name}modbuscontrollerid
    id: ${this.name}stateflags3
    name: "${this.name}stateflags3"
    address: ${this.stateFlagsRegister}
    register_type: holding
    bitmask: 0x3
  - platform: modbus_controller
    modbus_controller_id: ${this.name}modbuscontrollerid
    id: ${this.name}stateflags4
    name: "${this.name}stateflags4"
    address: ${this.stateFlagsRegister}
    register_type: holding
    bitmask: 0x10
`
}
]
if(this.dpEnabled){
    components.push(
{componentName: 'switch', payload:
`    - platform: gpio
      pin: ${this.enablePin}
      id: ${this.name}enablepin
      name: ${this.name}enablepin
`
},
{componentName: 'on_boot', payload:
`    - priority: -100
      then:
       - switch.turn_on: ${this.name}enablepin
       - wait_until:
            condition:
              mqtt.connected:
       - component.update: ${this.name}modbuscontrollerid
       - delay: 1s
       - deep_sleep.enter: ds
`
},
{componentName: 'on_shutdown', payload:
`    - priority: 700
      then:
       - switch.turn_off: ${this.name}enablepin
`
} 
            );
        }
        return components
    }
}

export default function modbusLoadCell(name, rxPin, enablePin, updateInterval, weightRegister, weightRegisters2Read, stateFlagsRegister) { 
    return new ModbusLoadCell(name, 'modbus', rxPin, enablePin, updateInterval, weightRegister, weightRegisters2Read, stateFlagsRegister);
}