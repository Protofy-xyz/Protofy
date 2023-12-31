export const manifest = {
    "name": "ESPHome",
    "version": "2022.12.8",
    "home_assistant_domain": "esphome",
    "funding_url": "https://esphome.io/guides/supporters.html",
    "builds": [
      {
        "chipFamily": "ESP32",
        "parts": [
          {
            "path": "https://firmware.esphome.io/esphome-web-esp32/esphome-web-esp32.bin",
            "offset": 0
          }
        ]
      },
      {
        "chipFamily": "ESP32-C3",
        "parts": [
          {
            "path": "https://firmware.esphome.io/esphome-web-esp32c3/esphome-web-esp32c3.bin",
            "offset": 0
          }
        ]
      },
      {
        "chipFamily": "ESP32-S2",
        "parts": [
          {
            "path": "https://firmware.esphome.io/esphome-web-esp32s2/esphome-web-esp32s2.bin",
            "offset": 0
          }
        ]
      },
      {
        "chipFamily": "ESP32-S3",
        "parts": [
          {
            "path": "https://firmware.esphome.io/esphome-web-esp32s3/esphome-web-esp32s3.bin",
            "offset": 0
          }
        ]
      },
      {
        "chipFamily": "ESP8266",
        "parts": [
          {
            "path": "https://firmware.esphome.io/esphome-web-esp8266/esphome-web-esp8266.bin",
            "offset": 0
          }
        ]
      }
    ]
  }