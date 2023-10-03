class LEDCOutput {
  name;
  platform;
  frequency;
  mqttTopicPrefix;
  constructor(name, platform,frequency) {
      this.name = name
      this.platform = platform
      this.frequency = frequency
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
      componentName: "on_json_message",
      payload:
`    - topic: ${this.mqttTopicPrefix}/output/${this.name}/command
      then:
      - lambda: |-
          if (x.containsKey("pwmLevel"))  {
            id(${this.name}).set_level((float)x["pwmLevel"]);
          }
`

  },
//   {
// componentName:'script',
// payload:
// `   - id: ${this.name}SetLevel
//      parameters:
//        level: int
//      then:
//        - lambda: !lambda id(${this.name}).set_level(level/100);
// `
//       },  
    {componentName: 'output',payload:
`    - platform: ${this.platform}
      pin: ${pin}
      id: ${this.name}
      frequency: ${this.frequency}
`
  } ]
  }
}

export default function lEDCOutput(name,frequency) { 
  return new LEDCOutput(name, 'ledc',frequency);
}