class A4988 {
    name;
    type;
    platform;
    dirPin
    maxSpeed;
    sleepPin;
    acceleration;
    deceleration;
    constructor(name, platform, dirPin, maxSpeed, sleepPin, acceleration, deceleration) {
        this.type = "stepper"
        this.name = name
        this.platform = platform
        this.dirPin = dirPin
        this.maxSpeed = maxSpeed
        this.sleepPin = sleepPin
        this.acceleration = acceleration
        this.deceleration = deceleration
    }
    extractNestedComponents(element, deviceComponents) {
      const keysToExtract = [
        { key: 'mqtt', nestedKey: 'on_message' },
        { key: 'esphome', nestedKey: 'on_boot' }
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
  
    exctractComponent(element, deviceComponents) {
      if (['mqtt', 'esphome'].includes(element.name)) {
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
            name: this.type,
            config: {
              platform: this.platform,
              id: this.name,
              step_pin: pin,
              dir_pin: this.dirPin,
              max_speed: this.maxSpeed,
              // sleep_pin: this.sleepPin,
              acceleration: this.acceleration,
              deceleration: this.deceleration
            },
            subsystem: this.getSubsystem()
          },
          {
            name: "switch",
            config: {
              platform: "gpio",
              pin: this.sleepPin,
              name: this.name+"_sleep_switch",
              id: this.name+"_sleep_switch",
              restore_mode: "ALWAYS_ON",
            }
          },
          {
            name: 'mqtt',
            config: {
              on_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/set_target`,
                  then: {
                    lambda:
`id(${this.name}_sleep_switch).turn_off();
int value = atoi(x.c_str());
id(${this.name}).set_target(value);
ESP_LOGD("Set target", "${this.name} stepper target set to: %d",  value);
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
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/set_max_speed`,
                  then: {
                    lambda:
`int value = atoi(x.c_str());
if (value > 0){
  id(${this.name}).set_max_speed(value);
  ESP_LOGD("Set max speed", "${this.name} stepper max speed set to: %d",  value);
} else {
  ESP_LOGD("Set max speed", "${this.name} invalid max speed value");
}`,
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
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/set_acceleration`,
                  then: {
                    lambda:
`int value = atoi(x.c_str());
if (value > 0){
  id(${this.name}).set_acceleration(value);
  ESP_LOGD("Set acceleration", "${this.name} stepper acceleration set to: %d",  value);
} else {
  ESP_LOGD("Set acceleration", "${this.name} invalid acceleration value");
}`,
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
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/set_deceleration`,
                  then: {
                    lambda:
`int value = atoi(x.c_str());
if (value > 0){
  id(${this.name}).set_acceleration(value);
  ESP_LOGD("Set deceleration", "${this.name} stepper deceleration set to: %d",  value);
} else {
  ESP_LOGD("Set deceleration", "${this.name} invalid deceleration value");
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
                  topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/report_position`,
                  then: {
                    lambda:
`int value = atoi(x.c_str());
id(${this.name}).report_position(value);
ESP_LOGD("Report position", "${this.name} stepper report position set to: %d",  value);
`,
                  }
                }
              ]
            }
          },
        ]
    
        componentObjects.forEach((element, j) => {
          this.exctractComponent(element, deviceComponents)
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
              label: 'Set target',
              description: 'Sets target of the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/set_target",
              connectionType: 'mqtt',
              payload: {
                type: 'str'
              },
            },
            {
              name: 'set_max_speed',
              label: 'Set max speed',
              description: 'Sets speed of the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/set_max_speed",
              connectionType: 'mqtt',
              payload: {
                type: 'str'
              },
            },
            {
              name: 'set_acceleration',
              label: 'Set acceleration',
              description: 'Sets acceleration of the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/set_acceleration",
              connectionType: 'mqtt',
              payload: {
                type: 'str'
              },
            },
            {
              name: 'set_deceleration',
              label: 'Set deceleration',
              description: 'Sets deceleration of the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/set_deceleration",
              connectionType: 'mqtt',
              payload: {
                type: 'str'
              },
            },
            {
              name: 'report_position',
              label: 'Report position',
              description: 'Reports position of the stepper',
              endpoint: "/"+this.type+"/"+this.name+"/report_position",
              connectionType: 'mqtt',
              payload: {
                type: 'str'
              },
            },
            {
              name: 'hold_motor',
              label: 'Hold motor',
              description: "Holds the motor power, so it doesn't move",
              endpoint: "/switch/"+this.name+"_sleep_switch/command",
              connectionType: 'mqtt',
              payload: {
                type: 'str',
                value: 'OFF',
              },
            },
            {
              name: 'release_motor',
              label: 'Release motor',
              description: 'Releases the motor power, so it can move',
              endpoint: "/switch/"+this.name+"_sleep_switch/command",
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

export function a4988(name, dirPin, maxSpeed, sleepPin, acceleration, deceleration) { 
    return new A4988(name, 'a4988', dirPin, maxSpeed, sleepPin, acceleration, deceleration);
}