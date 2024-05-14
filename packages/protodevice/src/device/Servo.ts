import { extractComponent } from "./utils"

class Servo {
    name;
    platform;
    mqttTopicPrefix;
    type;
    minLevel;
    idleLevel;
    maxLevel;
    constructor(name, platform,minLevel,idleLevel,maxLevel) {
        this.name = name
        this.type = 'servo'
        this.platform = platform
        this.mqttTopicPrefix = ''
        this.minLevel = minLevel
        this.idleLevel = idleLevel
        this.maxLevel = maxLevel
    }

    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }


    attach(pin,deviceComponents) {
        const componentObjects = [
            {
              name: this.type,
              config: {
                id: this.name,
                output: `${this.name}ledcOutput`,
                auto_detach_time: "0s",
                transition_length: "0s",
                min_level: `${this.minLevel}%`,
                idle_level: `${this.idleLevel}%`,
                max_level: `${this.maxLevel}%`
              },
              subsystem: this.getSubsystem()
            },
            {
              name: "output",
              config: {
                platform: this.platform,
                id: `${this.name}ledcOutput`,
                pin: pin,
                frequency: "50 Hz"
              },
            },
            {
              name: 'mqtt',
              config: {
                on_message: [
                  {
                    topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/command`,
                    then: [
                      {
                        lambda: `float value = atoi(x.c_str());
if(value >= 0 && value <= 180) id(${this.name}).write(-(90-value)/90);
if(value > 180) id(${this.name}).write(1.0);
if(value < 0) id(${this.name}).write(-1.0);`
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
              name: 'set_position',
              label: 'Set position',
              description: 'Moves the servo to desired position -180 to 180',
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

export function servo(name, minLevel,idleLevel,maxLevel) { 
    return new Servo(name, 'ledc',minLevel,idleLevel,maxLevel)
}