class ODriveCan {
    name;
    txPin;
    rxPin;
    bitRate;
    odriveCanId;
    type = 'motor';
    constructor(name, txPin, rxPin, bitRate, odriveCanId) {
      this.name = name;
      this.txPin = txPin;
      this.rxPin = rxPin;
      this.bitRate = bitRate;
      this.odriveCanId = odriveCanId;
      this.type = 'motor';
    }
    extractNestedComponents(element, deviceComponents) {
      const keysToExtract = [
        { key: 'mqtt', nestedKey: 'on_json_message' },
        { key: 'mqtt', nestedKey: 'on_message' },
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
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/set_speed`,
                  then: {
                    lambda:
`// Parse JSON payload
if (!x.containsKey("speed") || !x.containsKey("torque")) {
  ESP_LOGW("canbus", "Invalid payload. Expected keys: speed, torque.");
  return;
}
float input_vel = x["speed"].as<float>();  // Desired speed in rev/s
float torque_ff = x["torque"].as<float>();    // Torque feedforward in Nm

ESP_LOGD("canbus", "Parsed JSON: Velocity=%.2f, Torque=%.2f", input_vel, torque_ff);

// Check current axis state
uint8_t current_axis_state = id(${this.name}_axis_state_numeric).state;
if (current_axis_state != 8) {  // If not in CLOSED_LOOP_CONTROL
  // Set axis state to CLOSED_LOOP_CONTROL
  std::vector<uint8_t> state_data(4);
  uint32_t requested_state = 8;  // CLOSED_LOOP_CONTROL
  memcpy(&state_data[0], &requested_state, 4);
  ESP_LOGD("canbus", "Setting axis state to CLOSED_LOOP_CONTROL...");
  id(can_bus).send_data(0x07, false, state_data);

  // Set to speed control mode
  std::vector<uint8_t> mode_data(8);
  uint32_t control_mode = 2;  // VELOCITY_CONTROL
  uint32_t input_mode = 1;   // PASSTHROUGH
  memcpy(&mode_data[0], &control_mode, 4);
  memcpy(&mode_data[4], &input_mode, 4);
  ESP_LOGD("canbus", "Setting speed control mode...");
  id(can_bus).send_data(0x0B, false, mode_data);
} else {
  ESP_LOGD("canbus", "Motor is already in CLOSED_LOOP_CONTROL.");
}

// Set desired speed and torque
std::vector<uint8_t> vel_data(8);
memcpy(&vel_data[0], &input_vel, 4);   // Velocity in rev/s
memcpy(&vel_data[4], &torque_ff, 4);  // Torque feedforward in Nm

ESP_LOGD("canbus", "Setting speed: %.2f, Torque: %.2f", input_vel, torque_ff);
id(can_bus).send_data(0x0D, false, vel_data);  // Command ID for Set_Input_Vel
`,
                  }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/set_position`,
                  then: {
                    lambda:
`// Parse JSON payload
if (!x.containsKey("position") || !x.containsKey("velocity") || !x.containsKey("torque")) {
  ESP_LOGW("canbus", "Invalid payload. Expected keys: position, velocity, torque.");
  return;
}
float input_pos = x["position"].as<float>();  // Desired position in revolutions
int16_t vel_ff = x["velocity"].as<int16_t>();  // Velocity feedforward
int16_t torque_ff = x["torque"].as<int16_t>();  // Torque feedforward

ESP_LOGD("canbus", "Parsed JSON: Position=%.2f, Velocity=%d, Torque=%d", input_pos, vel_ff, torque_ff);

// Check current axis state
uint8_t current_axis_state = id(${this.name}_axis_state_numeric).state;
if (current_axis_state != 8) {  // If not in CLOSED_LOOP_CONTROL
  // Set axis state to CLOSED_LOOP_CONTROL
  std::vector<uint8_t> state_data(4);
  uint32_t requested_state = 8;  // CLOSED_LOOP_CONTROL
  memcpy(&state_data[0], &requested_state, 4);
  ESP_LOGD("canbus", "Setting axis state to CLOSED_LOOP_CONTROL...");
  id(can_bus).send_data(0x07, false, state_data);

  // Set to position control mode
  std::vector<uint8_t> mode_data(8);
  uint32_t control_mode = 3;  // POSITION_CONTROL
  uint32_t input_mode = 1;   // PASSTHROUGH
  memcpy(&mode_data[0], &control_mode, 4);
  memcpy(&mode_data[4], &input_mode, 4);
  ESP_LOGD("canbus", "Setting position control mode...");
  id(can_bus).send_data(0x0B, false, mode_data);
} else {
  ESP_LOGD("canbus", "Motor is already in CLOSED_LOOP_CONTROL.");
}

// Set desired position
std::vector<uint8_t> pos_data(8);
memcpy(&pos_data[0], &input_pos, 4);  // Position in revolutions
memcpy(&pos_data[4], &vel_ff, 2);    // Velocity feedforward
memcpy(&pos_data[6], &torque_ff, 2); // Torque feedforward

ESP_LOGD("canbus", "Setting position: %.2f, Velocity: %d, Torque: %d", input_pos, vel_ff, torque_ff);
id(can_bus).send_data(0x0C, false, pos_data);  // Command ID for Set_Input_Pos
`,
                  }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/calibrate_motor`,
                  then: {
                    lambda:
`// Parse JSON payload for optional axis ID (defaults to 0)
int axis_id = x.containsKey("axis_id") ? x["axis_id"].as<int>() : 0;

// Full calibration sequence value
uint32_t calibration_state = 3;  // FULL_CALIBRATION_SEQUENCE

// Prepare CAN message to set axis state to FULL_CALIBRATION_SEQUENCE
std::vector<uint8_t> calib_data(4);
memcpy(&calib_data[0], &calibration_state, 4);

ESP_LOGD("canbus", "Sending calibration command for axis %d...", axis_id);
id(can_bus).send_data(0x07, false, calib_data);

ESP_LOGD("canbus", "Calibration sequence started for axis %d.", axis_id);
`,                }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/find_encoder_index`,
                  then: {
                    lambda:
`// Parse JSON payload for optional axis ID (defaults to 0)
int axis_id = x.containsKey("axis_id") ? x["axis_id"].as<int>() : 0;

// Find encoder index value
uint32_t find_index_state = 6;  // ENCODER_INDEX_SEARCH

// Prepare CAN message to set axis state to ENCODER_INDEX_SEARCH
std::vector<uint8_t> index_data(4);
memcpy(&index_data[0], &find_index_state, 4);

ESP_LOGD("canbus", "Sending find encoder index command for axis %d...", axis_id);
id(can_bus).send_data(0x07, false, index_data);

ESP_LOGD("canbus", "Encoder index search started for axis %d.", axis_id);
`,                }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/clear_errors`,
                  then: {
                    lambda:
`// Parse JSON payload for optional axis ID (defaults to 0)
int axis_id = x.containsKey("axis_id") ? x["axis_id"].as<int>() : 0;

// Prepare CAN message to clear errors
uint8_t clear_errors_command = 0;  // No payload required for clear errors
std::vector<uint8_t> clear_data(1);
clear_data[0] = clear_errors_command;

ESP_LOGD("canbus", "Sending clear errors command for axis %d...", axis_id);
id(can_bus).send_data(0x18, false, clear_data);  // Command ID for Clear_Errors

ESP_LOGD("canbus", "Clear errors command sent for axis %d.", axis_id);
`,                }
                }
              ]
            }
          },
          {
            name: 'mqtt',
            config: {
              on_json_message: [
                {
                  topic: `devices/${deviceComponents.esphome.name}/${this.name}/set_current_state`,
                  then: {
                    lambda:
`// Parse JSON payload for state
if (!x.containsKey("state")) {
  ESP_LOGW("canbus", "Invalid payload. Expected key: state.");
  return;
}
uint32_t requested_state = x["state"].as<uint32_t>();  // Desired ODrive state

// Validate the requested state
if (requested_state < 1 || requested_state > 14) {
  ESP_LOGW("canbus", "Invalid state value: %d. Must be between 1 and 14.", requested_state);
  return;
}

ESP_LOGD("canbus", "Changing ODrive current state to: %d", requested_state);

// Prepare CAN message for setting the requested state
std::vector<uint8_t> state_data(4);
memcpy(&state_data[0], &requested_state, 4);

// Send the CAN message to change state
id(can_bus).send_data(0x07, false, state_data);  // 0x07 is the CAN ID for setting the axis state
`,                }
                }
              ]
            }
          },
          {
            name: 'sensor',
            config: {
              platform: 'template',
              name: `${this.name}_position`,
              id: `${this.name}_position`,
              unit_of_measurement: 'rev',
              accuracy_decimals: 2
            }
          },
          {
            name: 'sensor',
            config: {
              platform: 'template',
              name: `${this.name}_speed`,
              id: `${this.name}_speed`,
              unit_of_measurement: 'rev/s',
              accuracy_decimals: 2
            }
          },
          {
            name: 'text_sensor',
            config: {
              platform: 'template',
              name: `${this.name}_axis_state`,
              id: `${this.name}_axis_state`,
            }
          },
          {
            name: 'sensor',
            config: {
              platform: 'template',
              name: `${this.name}_axis_state_numeric`,
              id: `${this.name}_axis_state_numeric`,
              unit_of_measurement: 'state',
              accuracy_decimals: 0
            }
          },
          {
            name: 'sensor',
            config: {
              platform: 'template',
              name: `${this.name}_fet_temperature`,
              id: `${this.name}_fet_temperature`,
              unit_of_measurement: '°C',
              accuracy_decimals: 2
            }
          },
          {
            name: 'sensor',
            config: {
              platform: 'template',
              name: `${this.name}_motor_temperature`,
              id: `${this.name}_motor_temperature`,
              unit_of_measurement: '°C',
              accuracy_decimals: 2
            }
          },
          {
            name: 'text_sensor',
            config: {
              platform: 'template',
              name: `${this.name}_errors`,
              id: `${this.name}_errors`
            }
          },
          {
            name: 'canbus',
            config: {
              platform: 'esp32_can',
              id: 'can_bus',
              tx_pin: this.txPin,
              rx_pin: this.rxPin,
              can_id: this.odriveCanId,
              bit_rate: this.bitRate,
              on_frame: [
                {
                  can_id: 0x9,
                  then: [
                    {
                      lambda:
`// Decode the CAN message data for position and velocity
float pos_estimate = *reinterpret_cast<const float *>(&x[0]);
float vel_estimate = *reinterpret_cast<const float *>(&x[4]);

// Log the values
ESP_LOGD("canbus", "Position Estimate: %.2f, Velocity Estimate: %.2f", pos_estimate, vel_estimate);

// Update the template sensors
id(${this.name}_position).publish_state(pos_estimate);
id(${this.name}_speed).publish_state(vel_estimate);
`
                    }
                  ]
                },
                {
                  can_id: 0x1,
                  then: [
                    {
                      lambda:
`// Extract axis state and log it
uint8_t axis_state = x[4];
ESP_LOGD("canbus", "Axis State: %d", axis_state);

// Update the axis state numeric sensor
id(${this.name}_axis_state_numeric).publish_state(axis_state);

// Map the numeric state to a string and update the text sensor
if (axis_state == 1) {
  id(${this.name}_axis_state).publish_state("IDLE");
} else if (axis_state == 2) {
  id(${this.name}_axis_state).publish_state("STARTUP_SEQUENCE");
} else if (axis_state == 3) {
  id(${this.name}_axis_state).publish_state("FULL_CALIBRATION_SEQUENCE");
} else if (axis_state == 4) {
  id(${this.name}_axis_state).publish_state("MOTOR_CALIBRATION");
} else if (axis_state == 6) {
  id(${this.name}_axis_state).publish_state("ENCODER_INDEX_SEARCH");
} else if (axis_state == 7) {
  id(${this.name}_axis_state).publish_state("ENCODER_OFFSET_CALIBRATION");
} else if (axis_state == 8) {
  id(${this.name}_axis_state).publish_state("CLOSED_LOOP_CONTROL");
} else if (axis_state == 9) {
  id(${this.name}_axis_state).publish_state("LOCKIN_SPIN");
} else if (axis_state == 10) {
  id(${this.name}_axis_state).publish_state("ENCODER_DIR_FIND");
} else if (axis_state == 11) {
  id(${this.name}_axis_state).publish_state("HOMING");
} else if (axis_state == 12) {
  id(${this.name}_axis_state).publish_state("ENCODER_HALL_POLARITY_CALIBRATION");
} else if (axis_state == 13) {
  id(${this.name}_axis_state).publish_state("ENCODER_HALL_PHASE_CALIBRATION");
} else if (axis_state == 14) {
  id(${this.name}_axis_state).publish_state("ANTICOGGING_CALIBRATION");
} else {
  id(${this.name}_axis_state).publish_state("UNKNOWN");
}

// Log Trajectory Done Flag
bool trajectory_done_flag = x[6];
ESP_LOGD("canbus", "Trajectory Done Flag: %d", trajectory_done_flag);
`
                    }
                  ]
                },
                {
                  can_id: 0x15,
                  then: [
                    {
                      lambda:
`// Decode the CAN message data for temperatures
float fet_temperature = *reinterpret_cast<const float *>(&x[0]);
float motor_temperature = *reinterpret_cast<const float *>(&x[4]);

// Log the values
ESP_LOGD("canbus", "FET Temperature: %.2f°C, Motor Temperature: %.2f°C", fet_temperature, motor_temperature);

// Update the template sensors
id(${this.name}_fet_temperature).publish_state(fet_temperature);
id(${this.name}_motor_temperature).publish_state(motor_temperature);
`

                    }
                  ]
                },
                {
                  can_id: 0x03,
                  then: [
                    {
                      lambda:
`// Decode the CAN message data for errors
uint32_t active_errors = *reinterpret_cast<const uint32_t *>(&x[0]);
uint32_t disarm_reason = *reinterpret_cast<const uint32_t *>(&x[4]);

// Start with an empty error string
std::string error_string = "";

// Decode active errors
if (active_errors == 0) {
  error_string = "No errors; ";
} else {
  // System errors
  if (active_errors & 0x01) error_string += "INITIALIZING; ";
  if (active_errors & 0x02) error_string += "SYSTEM_LEVEL; ";
  if (active_errors & 0x04) error_string += "TIMING_ERROR; ";
  if (active_errors & 0x08) error_string += "MISSING_ESTIMATE; ";
  if (active_errors & 0x10) error_string += "BAD_CONFIG; ";
  if (active_errors & 0x20) error_string += "DRV_FAULT; ";
  if (active_errors & 0x40) error_string += "MISSING_INPUT; ";
  if (active_errors & 0x100) error_string += "DC_BUS_OVER_VOLTAGE; ";
  if (active_errors & 0x200) error_string += "DC_BUS_UNDER_VOLTAGE; ";
  if (active_errors & 0x400) error_string += "DC_BUS_OVER_CURRENT; ";
  if (active_errors & 0x800) error_string += "DC_BUS_OVER_REGEN_CURRENT; ";
  if (active_errors & 0x1000) error_string += "CURRENT_LIMIT_VIOLATION; ";
  if (active_errors & 0x2000) error_string += "MOTOR_OVER_TEMP; ";
  if (active_errors & 0x4000) error_string += "INVERTER_OVER_TEMP; ";
  if (active_errors & 0x8000) error_string += "VELOCITY_LIMIT_VIOLATION; ";
  if (active_errors & 0x10000) error_string += "POSITION_LIMIT_VIOLATION; ";
  if (active_errors & 0x1000000) error_string += "WATCHDOG_TIMER_EXPIRED; ";
  if (active_errors & 0x2000000) error_string += "ESTOP_REQUESTED; ";
  if (active_errors & 0x4000000) error_string += "SPINOUT_DETECTED; ";
  if (active_errors & 0x8000000) error_string += "BRAKE_RESISTOR_DISARMED; ";
  if (active_errors & 0x10000000) error_string += "THERMISTOR_DISCONNECTED; ";
  if (active_errors & 0x40000000) error_string += "CALIBRATION_ERROR; ";
}

// Decode disarm reasons
if (disarm_reason != 0) {
  error_string += "Disarm Reasons: ";
  if (disarm_reason & 0x01) error_string += "ESTOP Requested; ";
  if (disarm_reason & 0x02) error_string += "Watchdog Timeout; ";
  if (disarm_reason & 0x04) error_string += "Invalid State Transition; ";
  if (disarm_reason & 0x08) error_string += "Motor Error; ";
  if (disarm_reason & 0x10) error_string += "Encoder Error; ";
}

// Log and publish the error string
ESP_LOGD("canbus", "ODrive Errors: %s", error_string.c_str());
id(${this.name}_errors).publish_state(error_string.c_str());
`

                    }
                  ]
                },
              ]
            }
          }



        ]
    
        componentObjects.forEach((element, j) => {
          this.extractComponent(element, deviceComponents)
        })
        return deviceComponents
      }
      getSubsystem() {
        return {
          name: this.name,
          type: this.type,
          actions: [
            {
              name: 'set_speed',
              label: 'Set Speed',
              description: 'Sets the motor speed and torque feedforward',
              endpoint: `/${this.name}/set_speed`,
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                schema: {
                  speed: { type: 'float', description: 'Speed in rev/s' },
                  torque: { type: 'float', description: 'Torque in Nm' },
                },
              },
            },
            {
              name: 'set_position',
              label: 'Set Position',
              description: 'Sets the motor position, velocity, and torque feedforward',
              endpoint: `/${this.name}/set_position`,
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                schema: {
                  position: { type: 'float', description: 'Position in revolutions' },
                  velocity: { type: 'int', description: 'Velocity feedforward' },
                  torque: { type: 'int', description: 'Torque feedforward' },
                },
              },
            },
            {
              name: 'set_current_state',
              label: 'Set Current State',
              description: 'Changes the current state of the ODrive',
              endpoint: `/${this.name}/set_current_state`,
              connectionType: 'mqtt',
              payload: [
                { label: 'IDLE', value: {state: 1} },
                { label: 'STARTUP_SEQUENCE', value: {state: 2} },
                { label: 'FULL_CALIBRATION_SEQUENCE', value: {state: 3}},
                { label: 'MOTOR_CALIBRATION', value: {state: 4}},
                { label: 'ENCODER_INDEX_SEARCH', value: {state: 6}},
                { label: 'ENCODER_OFFSET_CALIBRATION', value: {state: 7}},
                { label: 'CLOSED_LOOP_CONTROL', value: {state: 8}},
                { label: 'LOCKIN_SPIN', value: {state: 9}},
                { label: 'ENCODER_DIR_FIND', value: {state: 10}},
                { label: 'HOMING', value: {state: 11}},
                { label: 'ENCODER_HALL_POLARITY_CALIBRATION', value: {state: 12}},
                { label: 'ENCODER_HALL_PHASE_CALIBRATION', value: {state: 13}},
                { label: 'ANTICOGGING_CALIBRATION', value: {state: 14}},
              ]
            },
            {
              name: 'calibrate_motor',
              label: 'Calibrate Motor',
              description: 'Performs full motor calibration',
              endpoint: `/${this.name}/calibrate_motor`,
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                value: {}
              },
            },
            {
              name: 'find_encoder_index',
              label: 'Find Encoder Index',
              description: 'Searches for the encoder index',
              endpoint: `/${this.name}/find_encoder_index`,
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                value: {}
              },
            },
            {
              name: 'clear_errors',
              label: 'Clear Errors',
              description: 'Clears any errors from the motor',
              endpoint: `/${this.name}/clear_errors`,
              connectionType: 'mqtt',
              payload: {
                type: 'json-schema',
                value: {}
              },
            },
            {
              name: 'idle',
              label: "IDLE motor",
              description: "Sets the motor to idle",
              endpoint: `/${this.name}/set_current_state`,
              connectionType: 'mqtt',
              payload: {
                type: 'json',
                value: {state: 1}
              }
            }

          ],
          monitors: [
            {
              name: 'position',
              label: 'Position',
              description: 'Tracks the motor position in revolutions',
              units: 'rev',
              endpoint: `/sensor/${this.name}_position/state`,
              connectionType: 'mqtt',
            },
            {
              name: 'speed',
              label: 'Speed',
              description: 'Tracks the motor speed in revolutions per second',
              units: 'rev/s',
              endpoint: `/sensor/${this.name}_speed/state`,
              connectionType: 'mqtt',
            },
            {
              name: 'axis_state',
              label: 'Axis State',
              description: 'Monitors the current state of the motor axis',
              endpoint: `/sensor/${this.name}_axis_state/state`,
              connectionType: 'mqtt',
            },
            {
              name: 'fet_temperature',
              label: 'FET Temperature',
              description: 'Monitors the FET temperature',
              units: '°C',
              endpoint: `/sensor/${this.name}_fet_temperature/state`,
              connectionType: 'mqtt',
            },
            {
              name: 'motor_temperature',
              label: 'Motor Temperature',
              description: 'Monitors the motor temperature',
              units: '°C',
              endpoint: `/sensor/${this.name}_motor_temperature/state`,
              connectionType: 'mqtt',
            },
            {
              name: 'errors',
              label: 'Errors',
              description: 'Logs any errors from the ODrive',
              endpoint: `/sensor/${this.name}_errors/state`,
              connectionType: 'mqtt',
            },            
          ]
                
          
        }
      }
}

export function odrivecan(name, txPin, rxPin, bitRate, odriveCanId) { 
    return new ODriveCan(name, txPin, rxPin, bitRate, odriveCanId);
}