class MKSServo42 {
    type;
    name;
    canBusId;
    motorId
    constructor(name, canBusId, motorId) {
        this.type = 'canbus'
        this.name = name
        this.canBusId = canBusId
        this.motorId = motorId
    }
    extractNestedComponents(element, deviceComponents) {
      const keysToExtract = [
        { key: 'mqtt', nestedKey: 'on_message' },
        { key: 'mqtt', nestedKey: 'on_json_message' },
        { key: 'canbus', nestedKey: 'on_frame' }
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
      if (['mqtt', 'canbus'].includes(element.name)) {
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
            name: 'script',
            config: [
              {
                id: `${this.name}_send_set_target`,
                parameters: {
                  speed: 'int',
                  acc: 'int',
                  pulse: 'int',
                },
                then: {
                  lambda: 
`if (pulse > 8388607) pulse = 8388607;
if (pulse < -8388607) pulse = -8388607;

uint8_t pulse_high = (uint8_t)((pulse & 0x00FF0000) >> 16);
uint8_t pulse_mid = (uint8_t)((pulse & 0x0000FF00) >> 8);
uint8_t pulse_low = (uint8_t)(pulse & 0x000000FF);

std::vector<uint8_t> data = {
  0xFE,
  (uint8_t)((speed & 0xFF00) >> 8),
  (uint8_t)(speed & 0x00FF),
  acc,
  pulse_high,
  pulse_mid,
  pulse_low
};

uint8_t crc = 1;
for (int i = 0; i < data.size(); i++) {
  crc += data[i];
}
crc &= 0xFF;
data.push_back(crc);

id(${this.canBusId}).send_data(${this.motorId}, false, data);
`
                }
              },
              {
                id: `${this.name}_send_home`,
                then: {
                  "canbus.send": {
                    can_id: this.motorId,
                    data: '@[0x91, 0x92]@',
                  }
                }
              },
              {
                id: `${this.name}_send_enable_rotation`,
                parameters: {
                  state: 'string',
                },
                then: {
                  lambda:
`std::vector<uint8_t> data = {0xF3, 0x00};
if (state == "ON") {
  data[1] += 1;
}

uint8_t crc = 1;
for (int i = 0; i < data.size(); i++) {
  crc += data[i];
}
crc &= 0xFF;
data.push_back(crc);

id(${this.canBusId}).send_data(${this.motorId}, false, data);
`
                }
              },
              {
                id: `${this.name}_send_limit_remap`,
                parameters: {
                  state: 'string',
                },
                then: {
                  lambda: 
`std::vector<uint8_t> data = {0x9E, 0x00};
if (state == "ON") {
  data[1] = 0x01;
} else if (state == "OFF") {
  data[1] = 0x00;
} else {
  ESP_LOGW("MKS SERVO42D", "Invalid payload for set_limit_remap: %s", state.c_str());
  return;
}

uint8_t crc = 1;
for (int i = 0; i < data.size(); i++) {
  crc += data[i];
}
crc &= 0xFF;
data.push_back(crc);

id(${this.canBusId}).send_data(${this.motorId}, false, data);
`
                }
              }
            ]
          },
          {
            name: this.type,
            config: {
              on_frame: [
                {
                  can_id: this.motorId,
                  then: {
                    lambda:
  `std::string b(x.begin(), x.end());
  ESP_LOGD("can id 1", "%s", &b[0] );
  
  if(x.size() > 0 & x[0] == 0xfc) {
    char motor_states[4][100] = {"run fail", "run starting", "run complete", "end limit stoped"};
    switch(x[1]) {
        ESP_LOGD("MKS SERVO42D","Step control response = %X", x[1] );
        case 0x00: id(${this.name}_step_state).publish_state(motor_states[0]); break;
        case 0x02: id(${this.name}_step_state).publish_state(motor_states[1]); break;
        case 0x04: id(${this.name}_step_state).publish_state(motor_states[2]); break;
        case 0x08: id(${this.name}_step_state).publish_state(motor_states[3]); break;
      }
  }
  
  if(x.size() > 0 & x[0] == 0x22) {
    char homing_states[3][100] = {"go home fail", "go home start", "go home sucess"};
    switch(x[1]) {
        ESP_LOGD("MKS SERVO42D","Homing response = %X", x[1] );
        case 0x00: id(${this.name}_home_state).publish_state(homing_states[0]); break;
        case 0x03: id(${this.name}_home_state).publish_state(homing_states[1]); break;
        case 0x05: id(${this.name}_home_state).publish_state(homing_states[2]); break;
      }
  }
  `
                  }
                }
              ]
            },
            subsystem: this.getSubsystem()
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/set_target`,
                  then: {
                    lambda: 
`id(${this.name}_send_set_target)->execute((int)x["speed"], (int)x["acc"], (int)x["pulses"]);
`
                  }
                }
              ],
              on_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/home`,
                  then: {
                    "script.execute": `${this.name}_send_home`
                  }
                },
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/enable_rotation`,
                  then: {
                    lambda: 
`id(${this.name}_send_enable_rotation)->execute(x);
`
                  }
                },
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/set_limit_remap`,
                  then: {
                    lambda: 
`id(${this.name}_send_limit_remap)->execute(x);
`
                  }
                }
              ]
            }
          },
          {
            name: 'text_sensor',
            config: { 
              platform: "template",
              name: `${this.name}_step_state`,
              id: `${this.name}_step_state`,
            }
          },
          {
            name: 'text_sensor',
            config: { 
              platform: "template",
              name: `${this.name}_home_state`,
              id: `${this.name}_home_state`,
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
              name: 'set_target',
              label: 'Target',
              description: 'Sets target of the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/set_target",
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                schema: {
                  "pulses": { "type": "int"},
                  "acceleration": { "type": "int"},
                  "speed": { "type": "int"}
                }
              },
            },
            {
              name: 'home',
              label: 'Home',
              description: 'Homes the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/home",
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'ON',
              },
            },
            {
              name: 'hold_motor',
              label: 'Hold motor',
              description: "Holds the motor power, so it doesn't move",
              endpoint: `/${this.type}/${this.name}/enable_rotation`,
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'ON',
              },
            },
            {
              name: 'release_motor',
              label: 'Release motor',
              description: 'Releases the motor power, so it can move',
              endpoint: `/${this.type}/${this.name}/enable_rotation`,
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'OFF',
              },
            },
          ],
          monitors:[
            {
                name: "step_state",
                label: "Step state",
                description: "state of the motor after receiving a command of movement by steps",
                endpoint: "/sensor/"+`${this.name}_step_state`+"/state",
                connectionType: "mqtt",
            },
            {
                name: "homing_state",
                label: "Homing state",
                description: "state of the motor after receiving a command of homing",
                endpoint: "/sensor/"+`${this.name}_home_state`+"/state",
                connectionType: "mqtt",
            },
        ]
        }
      }
}

export function mksServo42(name, canBusId, motorId) { 
    return new MKSServo42(name, canBusId, motorId);
}