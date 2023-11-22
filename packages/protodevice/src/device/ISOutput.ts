class ISOutput {
    name;
    platform;
    mqttTopicPrefix;
    constructor(name, platform) {
        this.name = name
        this.platform = platform
        this.mqttTopicPrefix = ''
    }
  
  
  /*mqtt:
    broker: 192.168.0.45
    topic_prefix: protofy-seed/mydevice
    on_json_message:
      topic: protofy-seed/mydevice/output/pwm1/command
      then:
        - lambda: |-
            if (x.containsKey("pwmLevel"))  {
              id(pwm1SetLevel).execute(x['pwmLevel']);
            }
  
  script:
  - id: pwm1SetLevel
    parameters:
      level: int
    then:
      - lambda: !lambda id(pwm1).set_level(level/100);
  */
  
    setMqttTopicPrefix(setMqttTopicPrefix){
        this.mqttTopicPrefix= setMqttTopicPrefix;
    }
  
  
    attach(pin) {
        return [
    {
        componentName: "on_message",
        payload:
  `    - topic: ${this.mqttTopicPrefix}/output/${this.name}/command
      then:
        - lambda: |-
            if (x=="ON")  {
              id(${this.name}).turn_on();
            }else{
              id(${this.name}).turn_off();
            }
  `
  
    },
    {componentName: 'i2c',
    payload:
    `   sda: 21
   scl: 22
   scan: true
   id: bus_a

`
    },
    {componentName: this.platform,
    payload:
    `    - id: pca9685_hub1
      frequency: 100

`
    },
   {componentName: 'output',payload:
  `    - platform: ${this.platform}
      channel: 11
      id: ${this.name}
      pca9685_id: 'pca9685_hub1'

`
    } ]
    }
  }
  
  export default function isOutput(name) { 
    return new ISOutput(name, 'pca9685');
  }