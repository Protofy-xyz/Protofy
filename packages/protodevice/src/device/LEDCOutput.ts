import { extractComponent } from "./utils"

class LEDCOutput {
    name;
    platform;
    mqttTopicPrefix;
    type;
    frequency;
    constructor(name, platform,frequency) {
        this.name = name
        this.type = 'pwm'
        this.platform = platform
        this.mqttTopicPrefix = ''
        this.frequency = frequency
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }


    attach(pin,deviceComponents) {
        const componentObjects = [
            {
              name: "output",
              config: {
                platform: this.platform,
                id: `${this.name}`,
                pin: pin,
                frequency: this.frequency
              },
              subsystem: this.getSubsystem()
            },
            {
              name: 'mqtt',
              config: {
                on_message: [
                  {
                    topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/command`,
                    then: [
                      {
                        lambda: `float value = atoi(x.c_str()); id(${this.name}).set_level(value);`
                    },
                    ]
                  }
                ]
              }
            }
          ]
          componentObjects.forEach((element, j) => {
            deviceComponents = extractComponent(element, deviceComponents, [{ key: 'mqtt', nestedKey: 'on_message' }])
          })
          return deviceComponents
    }

    getSubsystem() {
        return {
          name: this.name,
          type: this.type,
          config:{
          },
          actions: [
            {
              name: 'set_pwm_percentage',
              label: 'Set pwm percentage',
              description: 'Set the pwm level in percentage 0-100',
              endpoint: "/"+this.type+"/"+this.name+"/command",
              connectionType: 'mqtt',
              payload: {
                type: 'str',
              },
            },
          ]
        }
      }
}

export function ledcOutput(name, frequency) { 
    return new LEDCOutput(name, 'ledc',frequency);
}