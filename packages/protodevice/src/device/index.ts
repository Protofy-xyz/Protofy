import wifi from './Wifi'
import mqtt from './Mqtt'
import deepSleep from './DeepSleep'
import binarySensor from './BinarySensor'
import device from './Device'
import neopixelsBus from './NeopixelsBus'
import output from './Output'
import relay from './Relay'
import adcSensor from './ADCSensor'
import pulseCounter from './PulseCounter'
import ledcOutput from './LEDCOutput'
import pirSensor from './PIRSensor'
import hx711 from './HX711'
import capacitiveSoilMoistureSensor from './CapacitiveSoilMoistureSensor'
import nfcReader from './NFCReader'
import ultrasonicDistanceSensor from './UltrasonicDistanceSensor'
import isOutput from './ISOutput'
import dfplayer from './DfPlayer'
import xiaomiMiFlora from './XiaomiMiFlora'
import climateIR from './ClimateIR'
import servo from './Servo'
import mpr121 from './Mpr121'
import tempHumidity from './TempHumidity'
import modbusLoadCell from './ModbusLoadCell'
import bh1750 from './BH1750'
import hm3301 from './HM3301'
import sen0377 from './SEN0377'
import mpu6050 from './MPU6050'
import i2cSensorMatrix from './I2cSensorMatrix'
import sen55 from './SEN55'
import mhz19 from './MHZ19'

export default {
  wifi: wifi,
  mqtt: mqtt,
  deepSleep: deepSleep,
  device: device,
  output: output,
  binarySensor: binarySensor,
  neopixelsBus: neopixelsBus,
  relay: relay,
  adcSensor: adcSensor,
  capacitiveSoilMoistureSensor: capacitiveSoilMoistureSensor,
  pulseCounter: pulseCounter,
  ledcOutput: ledcOutput,
  pirSensor: pirSensor,
  hx711: hx711,
  nfcReader: nfcReader,
  ultrasonicDistanceSensor: ultrasonicDistanceSensor,
  isOutput: isOutput,
  dfplayer: dfplayer,
  xiaomiMiFlora: xiaomiMiFlora,
  climateIR: climateIR,
  servo: servo,
  mpr121: mpr121,
  tempHumidity:tempHumidity,
  modbusLoadCell:modbusLoadCell,
  bh1750:bh1750,
  hm3301:hm3301,
  sen0377:sen0377,
  mpu6050:mpu6050,
  i2cSensorMatrix:i2cSensorMatrix,
  sen55:sen55,
  mhz19:mhz19
}