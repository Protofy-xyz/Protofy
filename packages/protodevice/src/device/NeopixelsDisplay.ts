import { config } from "googleapis/build/src/apis/config";

class NeopixelDisplay {
    name;
    platform;
    rgb_order;
    chipset;
    numLeds;
    restoreMode;
    channel;
    width;
    height;
    type;
    constructor(name, platform, width, height, rgb_order, chipset, restoreMode, channel) {
        this.name = name
        this.type = 'display'
        this.platform = platform
        this.rgb_order = rgb_order
        this.chipset = chipset
        this.numLeds = width * height
        this.restoreMode = restoreMode
        this.channel = channel
        this.width = width
        this.height = height
    }
    extractNestedComponents(element, deviceComponents) {
        const keysToExtract = [
          { key: 'mqtt', nestedKey: 'on_message' },
          { key: 'mqtt', nestedKey: 'on_json_message' },
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
                name: "light",
                config: {
                    platform: "esp32_rmt_led_strip",
                    pin: pin,
                    name: this.name+"_light",
                    id: this.name+"_light",
                    chipset: this.chipset,
                    num_leds: this.numLeds,
                    rgb_order: this.rgb_order,
                    restore_mode: this.restoreMode,
                    default_transition_length: "0s",
                },
                subsystem: this.getSubsystem()

            },
            {
                name: this.type,
                // display:
                // - platform: addressable_light
                //   id: led_matrix_display
                //   addressable_light_id: neopixels
                //   width: 8
                //   height: 8
                //   rotation: 0
                //   update_interval: 0ms
                config: {
                    platform: this.platform,
                    id: this.name,
                    addressable_light_id: this.name+"_light",
                    width: this.width,
                    height: this.height
                }
            },
            {
                name: "external_components",
                config: {
                    //@ts-ignore
                    source: "github://Protofy-xyz/esphome-components",
                    refresh: "0s",
                    components: ["display"]
                }
            },
            {
                name: 'mqtt',
                config: {
                  on_json_message: [
                    {
                      topic: `devices/${deviceComponents.esphome.name}/${this.type}/${this.name}/draw`,
                      then: {
                        lambda:
`// Get the "action" key from the JSON
std::string action = x["action"].as<std::string>();
ESP_LOGD("${this.name}", "Received action: %s", action.c_str());

// Helper to parse color from JSON
auto get_color = [&]() {
  int r = x["r"];
  int g = x["g"];
  int b = x["b"];
  return Color(r, g, b);
};

if (action == "clear") {
  ESP_LOGD("${this.name}", "Clearing the display");
  id(${this.name}).clear();
  id(${this.name}).do_update_();
}
else if (action == "pixel") {
  int px = x["x"];
  int py = x["y"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Drawing pixel at (%d, %d) -> R:%d G:%d B:%d",
            px, py, c.red, c.green, c.blue);
  id(${this.name}).draw_pixel_at(px, py, c);
  id(${this.name}).do_update_();
}
else if (action == "line") {
  int x1 = x["x1"];
  int y1 = x["y1"];
  int x2 = x["x2"];
  int y2 = x["y2"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Drawing line from (%d, %d) to (%d, %d) -> R:%d G:%d B:%d",
            x1, y1, x2, y2, c.red, c.green, c.blue);
  id(${this.name}).line(x1, y1, x2, y2, c);
  id(${this.name}).do_update_();
}
else if (action == "rectangle") {
  int rx = x["x"];
  int ry = x["y"];
  int width = x["width"];
  int height = x["height"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Drawing rectangle at (%d, %d) size (%d, %d) -> R:%d G:%d B:%d",
            rx, ry, width, height, c.red, c.green, c.blue);
  id(${this.name}).rectangle(rx, ry, width, height, c);
  id(${this.name}).do_update_();
}
else if (action == "filled_rectangle") {
  int rx = x["x"];
  int ry = x["y"];
  int width = x["width"];
  int height = x["height"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Filling rectangle at (%d, %d) size (%d, %d) -> R:%d G:%d B:%d",
            rx, ry, width, height, c.red, c.green, c.blue);
  id(${this.name}).filled_rectangle(rx, ry, width, height, c);
  id(${this.name}).do_update_();
}
else if (action == "triangle") {
  int x1 = x["x1"];
  int y1 = x["y1"];
  int x2 = x["x2"];
  int y2 = x["y2"];
  int x3 = x["x3"];
  int y3 = x["y3"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Drawing triangle with points (%d,%d), (%d,%d), (%d,%d) -> R:%d G:%d B:%d",
            x1, y1, x2, y2, x3, y3, c.red, c.green, c.blue);
  id(${this.name}).triangle(x1, y1, x2, y2, x3, y3, c);
  id(${this.name}).do_update_();
}
else if (action == "filled_triangle") {
  int x1 = x["x1"];
  int y1 = x["y1"];
  int x2 = x["x2"];
  int y2 = x["y2"];
  int x3 = x["x3"];
  int y3 = x["y3"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Filling triangle with points (%d,%d), (%d,%d), (%d,%d) -> R:%d G:%d B:%d",
            x1, y1, x2, y2, x3, y3, c.red, c.green, c.blue);
  id(${this.name}).filled_triangle(x1, y1, x2, y2, x3, y3, c);
  id(${this.name}).do_update_();
}
else if (action == "circle") {
  int cx = x["x"];
  int cy = x["y"];
  int radius = x["radius"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Drawing circle at (%d, %d) radius %d -> R:%d G:%d B:%d",
            cx, cy, radius, c.red, c.green, c.blue);
  id(${this.name}).circle(cx, cy, radius, c);
  id(${this.name}).do_update_();
}
else if (action == "filled_circle") {
  int cx = x["x"];
  int cy = x["y"];
  int radius = x["radius"];
  Color c = get_color();
  ESP_LOGD("${this.name}", "Filling circle at (%d, %d) radius %d -> R:%d G:%d B:%d",
            cx, cy, radius, c.red, c.green, c.blue);
  id(${this.name}).filled_circle(cx, cy, radius, c);
  id(${this.name}).do_update_();
}
else {
  ESP_LOGW("${this.name}", "Unknown action: %s", action.c_str());
}
`
                      }
                    }
                  ]
                }
              },



        ]
        if(deviceComponents.esp32.framework.type == "arduino"){
            componentObjects[0].config["rmt_channel"] = this.channel
        }

        componentObjects.forEach((element, j) => {
            this.extractComponent(element, deviceComponents)
          })
        return deviceComponents;

    }
    getSubsystem() {
        return {
            name: this.name,
            type: this.type,
            actions: [
                {
                    name: 'draw_pixel',
                    label: 'Draw pixel', 
                    description: 'Draw pixel on display with given coordinates (x, y) and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["pixel"] },
                            "x": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_line',
                    label: 'Draw line', 
                    description: 'Draw line on display with given coordinates (x1, y1) and (x2, y2) and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["line"] },
                            "x1": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y1": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "x2": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y2": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_rectangle',
                    label: 'Draw rectangle', 
                    description: 'Draw rectangle on display with given coordinates (x, y) and size (width, height) and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["rectangle"] },
                            "x": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "width": { "type": "int", "minimum": 0, "maximum": this.width },
                            "height": { "type": "int", "minimum": 0, "maximum": this.height },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_filled_rectangle',
                    label: 'Draw filled rectangle',
                    description: 'Draw filled rectangle on display with given coordinates (x, y) and size (width, height) and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["filled_rectangle"] },
                            "x": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "width": { "type": "int", "minimum": 0, "maximum": this.width },
                            "height": { "type": "int", "minimum": 0, "maximum": this.height },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_triangle',
                    label: 'Draw triangle',
                    description: 'Draw triangle on display with given points (x1, y1), (x2, y2), (x3, y3) and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["triangle"] },
                            "x1": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y1": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "x2": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y2": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "x3": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y3": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_filled_triangle',
                    label: 'Draw filled triangle',
                    description: 'Draw filled triangle on display with given points (x1, y1), (x2, y2), (x3, y3) and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["filled_triangle"] },
                            "x1": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y1": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "x2": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y2": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "x3": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y3": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_circle',
                    label: 'Draw circle',
                    description: 'Draw circle on display with given center (x, y), radius and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["circle"] },
                            "x": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "radius": { "type": "int", "minimum": 0, "maximum": this.width },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'draw_filled_circle',
                    label: 'Draw filled circle',
                    description: 'Draw filled circle on display with given center (x, y), radius and color (r, g, b)',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["filled_circle"] },
                            "x": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "radius": { "type": "int", "minimum": 0, "maximum": this.width },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 }
                        }
                    }
                },
                {
                    name: 'clear',
                    label: 'Clear display',
                    description: 'Clear the display',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json',
                        value: {
                            "action": "clear"
                        }
                    }
                }
            ]
        }
    }
}

export function neopixelDisplay(name, width, height, rgb_order, chipset, restoreMode, channel) {
    return new NeopixelDisplay(name, 'addressable_light', width, height, rgb_order, chipset, restoreMode, channel)
}