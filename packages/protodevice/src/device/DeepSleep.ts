import device from "."

class DeepSleep {
  run_duration
  sleep_duration
  wakeup_pin
  mqttTopicPrefix
  constructor(run_duration, sleep_duration, wakeup_pin, mqttTopicPrefix) {
    this.run_duration = run_duration
    this.sleep_duration = sleep_duration
    this.wakeup_pin = wakeup_pin
    this.mqttTopicPrefix = ''
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
        name: 'deep_sleep',
        config: {
          id: 'ds',
          sleep_duration: this.sleep_duration + 's',
          wakeup_pin: this.wakeup_pin,
          wakeup_pin_mode: 'KEEP_AWAKE'
        }
      },
      {
        name: 'globals',
        config: {
          id: 'dp_run_duration',
          type: 'int',
          restore_value: 'yes',
          initial_value: this.run_duration
        }
      },
      {
        name: 'globals',
        config: {
          id: 'dp_sleep_duration',
          type: 'int',
          restore_value: 'yes',
          initial_value: this.sleep_duration
        }
      },
      {
        name: 'mqtt',
        config: {
          on_message: [
            {
              topic: `${deviceComponents.mqtt?.topic_prefix !== '' ? deviceComponents.mqtt?.topic_prefix + '/' + deviceComponents.esphome.name : deviceComponents.esphome.name}/deep_sleep/dp_sleep_duration/command`,
              then: {
                lambda:
`int value = atoi(x.c_str());
if (value == 0) {
  id(ds).prevent_deep_sleep();
  ESP_LOGD("Deep Sleep", "Deep Sleep disabled");
} else if (value > 0) {
  id(ds).allow_deep_sleep();
  id(dp_sleep_duration) = value;
  id(ds).set_sleep_duration(value * 1000);
  ESP_LOGD("Deep Sleep", "Deep Sleep sleep duration set to: %d", value);
  ESP_LOGD("Deep Sleep", "Global Deep Sleep sleep duration set to: %d", id(dp_run_duration));
} else {
  ESP_LOGD("Deep Sleep", "Invalid sleep duration value");
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
              topic: `${deviceComponents.mqtt?.topic_prefix !== '' ? deviceComponents.mqtt?.topic_prefix + '/' + deviceComponents.esphome.name : deviceComponents.esphome.name}/deep_sleep/dp_run_duration/command`,
              then: {
                lambda:
`int value = atoi(x.c_str());
if (value > 0){
  id(dp_run_duration) = value;
  id(ds).set_run_duration(value*1000);
  ESP_LOGD("Deep Sleep", "Deep Sleep run duration set to: %d",  value);
  ESP_LOGD("Deep Sleep", "Global Deep Sleep run duration set to: %d",  id(dp_run_duration));       
} else {
  ESP_LOGD("Deep Sleep", "Invalid run duration value");
}`,
              }
            }
          ]
        }
      },
      {
        name: 'esphome',
        config: {
          on_boot: [
            {
              priority: 600,
              then: {
                lambda:
`ESP_LOGD("Deep Sleep", "Global Deep Sleep run duration set to at boot: %d",  id(dp_run_duration));
id(ds).set_run_duration(id(dp_run_duration)*1000);
ESP_LOGD("Deep Sleep", "Global Deep Sleep sleep duration set to at boot: %d",  id(dp_sleep_duration));
id(ds).set_sleep_duration(id(dp_sleep_duration)*1000);`,
              }
            }
          ]
        }
      }
    ]
    componentObjects.forEach((element, j) => {
      this.exctractComponent(element, deviceComponents)
    })
    return deviceComponents
  }
}

export default function deepSleep(run_duration, sleep_duration, wakeup_pin, mqttTopicPrefix) {
  return new DeepSleep(run_duration, sleep_duration, wakeup_pin, mqttTopicPrefix)
}
