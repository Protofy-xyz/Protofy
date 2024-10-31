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

    constructor(name, timeId, jsonFileName, intervalSeconds, publishDataWhenOnline, publishDataTopic) {
        this.name = name;
        this.type = "sd_card_component";
        this.timeId = timeId;
        this.jsonFileName = jsonFileName;
        this.intervalSeconds = intervalSeconds;
        this.publishDataWhenOnline = publishDataWhenOnline;
        this.publishDataTopic = publishDataTopic;
        this.sensorsArray = [];
    }

    attach(pin, deviceComponents) {
        deviceComponents?.sensor?.forEach((sensor) => {
            if (sensor.name){
                this.sensorsArray.push(sensor.name);
            } else if (sensor.id){
                this.sensorsArray.push(sensor.id);
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
                    sensors: this.sensorsArray,
                },
            },
        ];

        componentObjects.forEach((element) => {
            if (!deviceComponents[element.name]) {
                deviceComponents[element.name] = element.config;
            } else {
                if (!Array.isArray(deviceComponents[element.name])) {
                    deviceComponents[element.name] = [deviceComponents[element.name]];
                }
                deviceComponents[element.name] = [...deviceComponents[element.name], element.config];
            }
        });

        return deviceComponents;
    }

    getSubsystem() {
        return {}
    }
}

export function sdOfflineLogger(name, timeId, jsonFileName, intervalSeconds, publishDataWhenOnline, publishDataTopic) { 
    return new SdOfflineLogger(name, timeId, jsonFileName, intervalSeconds, publishDataWhenOnline, publishDataTopic);
}
