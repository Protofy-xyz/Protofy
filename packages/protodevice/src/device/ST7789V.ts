import { update } from "@extensions/objects/context/objectUpdate";

class ST7789V {
    name;
    spiBusId;
    platform;
    type;
    cs_pin;
    dc_pin;
    reset_pin;
    backlight_pin;
    width;
    height;
    offset_height;
    offset_width;
    font_size;
    
    constructor(name, SpiBusId, platform, cs_pin, dc_pin, reset_pin, backlight_pin, width, height, offset_height, offset_width, font_size) {
        this.name = name
        this.spiBusId = SpiBusId
        this.type = 'display'
        this.platform = platform
        this.cs_pin = cs_pin
        this.dc_pin = dc_pin
        this.reset_pin = reset_pin
        this.backlight_pin = backlight_pin
        this.width = width
        this.height = height
        this.offset_height = offset_height
        this.offset_width = offset_width
        this.font_size = font_size
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
                name: this.type,
                config: {
                    platform: this.platform,
                    model: "Custom",
                    id: this.name,
                    spi_id: this.spiBusId,
                    width: this.width,
                    height: this.height,
                    backlight_pin: this.backlight_pin,
                    cs_pin: this.cs_pin,
                    dc_pin: this.dc_pin,
                    reset_pin: this.reset_pin,
                    offset_height: this.offset_height,
                    offset_width: this.offset_width,
                    update_interval: "0s",
                },
                subsystem: this.getSubsystem()

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
                name: "font",
                config: {
                    id: this.name+"_font",
                    size: this.font_size,
                    file: {
                        type: "gfonts",
                        family: "Roboto",
                        weight: 900
                    }
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
auto get_background_color = [&]() {
int r = 0;
int g = 0;
int b = 0;
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
else if (action == "text") {
    int tx = x["x"];
    int ty = x["y"];
    std::string text_str = x["text"].as<std::string>();
    Color c = get_color();
    Color bg = get_background_color();
    ESP_LOGD("${this.name}",
            "Printing text '%s' at (%d, %d) with Color R:%d, G:%d, B:%d and Background color R:%d, G:%d, B:%d",
            text_str.c_str(),
            tx,
            ty,
            c.red, c.green, c.blue,
            bg.red, bg.green, bg.blue);
    id(${this.name}).print(tx, ty, id(${this.name}_font), c, text_str.c_str(), bg);
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
                    name: 'draw_text',
                    label: 'Draw text',
                    description: 'Draw text on display with given coordinates (x, y), font, color (r, g, b) and text',
                    endpoint: "/" + this.type + "/" + this.name + "/draw",
                    connectionType: 'mqtt',
                    payload: {
                        type: 'json-schema',
                        schema: {
                            "action": { "type": "string", "enum": ["text"] },
                            "x": { "type": "int", "minimum": 0, "maximum": this.width - 1 },
                            "y": { "type": "int", "minimum": 0, "maximum": this.height - 1 },
                            "r": { "type": "int", "minimum": 0, "maximum": 255 },
                            "g": { "type": "int", "minimum": 0, "maximum": 255 },
                            "b": { "type": "int", "minimum": 0, "maximum": 255 },
                            "text": { "type": "string" }
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

export function st7789v(name, spiBusId, cs_pin, dc_pin, reset_pin, backlight_pin, width, height, offset_height, offset_width, font_size) {
    return new ST7789V(name, spiBusId, "st7789v", cs_pin, dc_pin, reset_pin, backlight_pin, width, height, offset_height, offset_width, font_size)
}