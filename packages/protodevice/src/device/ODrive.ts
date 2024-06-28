class ODrive {
    name;
    uartBusId;
    type = 'motor';
    constructor(name, uartBusId) {
      this.name = name;
      this.uartBusId = uartBusId;
    }
    extractNestedComponents(element, deviceComponents) {
      const keysToExtract = [
        { key: 'mqtt', nestedKey: 'on_json_message' },
        { key: 'mqtt', nestedKey: 'on_message' },
      ];
    
      keysToExtract.forEach(({ key, nestedKey }) => {
        if (element.config[nestedKey]) {
          if(!deviceComponents[key]) deviceComponents[key] = {}
          if(!deviceComponents[key][nestedKey]) deviceComponents[key][nestedKey] = []
  
          if(Array.isArray(deviceComponents[key][nestedKey])){
            deviceComponents[key][nestedKey].push(...element.config[nestedKey])
          } else {
            deviceComponents[key][nestedKey] = {
              ...deviceComponents[key][nestedKey],
              ...element.config[nestedKey]
            }
          }
        }
      });
    }
  
    extractComponent(element, deviceComponents) {
      if (['mqtt'].includes(element.name)) {
        this.extractNestedComponents(element, deviceComponents)
      } else {
        if (!deviceComponents[element.name]) {
          deviceComponents[element.name] = element.config
        } else {
          if (!Array.isArray(deviceComponents[element.name])) {
            deviceComponents[element.name] = [deviceComponents[element.name]]
          }
          deviceComponents[element.name].push(element.config)
        }
      }
    }
    attach(pin, deviceComponents) {
        const componentObjects = [
          {
            name: 'globals',
            config: {
              id: `${this.name}_current_state`,
              type: 'int',
              initial_value: '0'
            }
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/set_speed`,
                  then: {
                    lambda:
`if(x.containsKey("speed") && x.containsKey("ramp_rate")){
  float ramp_rate_value = x["ramp_rate"];
  float speed = x["speed"];
  
  if(id(${this.name}_current_state) != 8){
    id(${this.name}_current_state) = 8;
    id(${this.uartBusId}).write_str("w axis0.requested_state 8\\n");
  }

  if(ramp_rate_value == 0){
    id(${this.uartBusId}).write_str("w axis0.controller.config.input_mode 1\\n");
  } else{
    char buffer1[60];
    sprintf(buffer1, "w axis0.controller.config.vel_ramp_rate %.0f\\n", ramp_rate_value);
    id(${this.uartBusId}).write_str(buffer1);
    id(${this.uartBusId}).write_str("w axis0.controller.config.input_mode 2\\n");
  }

  char buffer2[60];
  sprintf(buffer2, "v 0 %.0f 0\\n", speed);
  id(${this.uartBusId}).write_str(buffer2);
}
`,
                  }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/clear_errors`,
                  then: {
                    lambda: `id(${this.uartBusId}).write_str("sc\\n");
                    `,
                  }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/idle`,
                  then: {
                    lambda: 
`id(${this.uartBusId}).write_str("w axis0.requested_state 1\\n");
id(${this.name}_current_state) = 1;
`,
                  }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/encoder_index_search`,
                  then: {
                    lambda: 
`id(${this.uartBusId}).write_str("w axis0.requested_state 6\\n");
id(${this.name}_current_state) = 6;
`,
                  }
                }
              ]
            }
          },

        ]
    
        componentObjects.forEach((element, j) => {
          this.extractComponent(element, deviceComponents)
        })
        return deviceComponents
      }
      getSubsystem() {
        return {
          name: this.name,
          type: this.type,
          actions: [
            {
              name: 'set_speed',
              label: 'Set speed',
              description: 'Sets speed of the motor',
              endpoint: `/${this.name}/set_speed`,
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                schema: {
                  "speed": { "type": "float"},
                  "ramp_rate": { "type": "float"},
                }
              },
            },
            {
              name: 'idle',
              label: 'Idle',
              description: 'Idles the motor',
              endpoint: `/${this.name}/idle`,
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'ON',
              },
            },
            {
              name: 'clear_errors',
              label: 'Clear errors',
              description: 'Clears errors of the motor',
              endpoint: `/${this.name}/clear_errors`,
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'ON',
              },
            },
            {
              name: 'encoder_index_search',
              label: 'Encoder index search',
              description: 'Searches for encoder index',
              endpoint: `/${this.name}/encoder_index_search`,
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'ON',
              },
            },
          ]
        }
      }
}

export function odrive(name, uartBusId) { 
    return new ODrive(name, uartBusId);
}