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

export default {
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
  tempHumidity:tempHumidity
}