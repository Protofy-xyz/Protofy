import { device } from "./Device";

class SdOfflineLogger {
    name;
    type;
    timeId;
    jsonFileName;
    intervalSeconds;
    publishDataWhenOnline;
    publishDataTopic;
    sensorsArray;
    numbersArray;

    constructor(name, timeId, jsonFileName, intervalSeconds, publishDataWhenOnline, publishDataTopic) {
        this.name = name;
        this.type = "sd_card_component";
        this.timeId = timeId;
        this.jsonFileName = jsonFileName;
        this.intervalSeconds = intervalSeconds;
        this.publishDataWhenOnline = publishDataWhenOnline;
        this.publishDataTopic = publishDataTopic;
        this.sensorsArray = [];
        this.numbersArray = [];
    }

    extractNestedComponents(element, deviceComponents) {
        const keysToExtract = [
          { key: 'esphome', nestedKey: 'libraries' }
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
        if (['esphome'].includes(element.name)) {
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
        deviceComponents?.sensor?.forEach((sensor) => {
            if (sensor.id){
                this.sensorsArray.push(sensor.id);
            }
        });

        deviceComponents?.number?.forEach((text_sensor) => {
            if (text_sensor.id){
                this.numbersArray.push(text_sensor.id);
            }
        });

        const componentObjects = [
            {
                name: "external_components",
                config: {
                    //@ts-ignore
                    source: "github://Protofy-xyz/esphome-components",
                    refresh: "10s",
                    components: ["sd_card_component"]
                }
            },
            {
                name: "sd_card_component",
                config: {
                    id: this.name,
                    cs_pin: pin,
                    time_id: this.timeId,
                    json_file_name: this.jsonFileName,
                    interval_seconds: this.intervalSeconds,
                    publish_data_when_online: this.publishDataWhenOnline,
                    publish_data_topic: deviceComponents.mqtt?.topic_prefix+this.publishDataTopic,
                    sensors: this.sensorsArray.length > 0 ? this.sensorsArray : undefined,
                    numbers: this.numbersArray.length > 0 ? this.numbersArray : undefined
                },
            }
        ];

        componentObjects.forEach((element, j) => {
            this.extractComponent(element, deviceComponents)
        })

        return deviceComponents;
    }

    getSubsystem() {
        return {}
    }
}

export function sdOfflineLogger(name, timeId, jsonFileName, intervalSeconds, publishDataWhenOnline, publishDataTopic) { 
    return new SdOfflineLogger(name, timeId, jsonFileName, intervalSeconds, publishDataWhenOnline, publishDataTopic);
}
