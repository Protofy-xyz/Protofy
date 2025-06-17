import { ArduinosModel } from './arduinosSchemas';
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { SerialManager } from './serialport/serialManager';
import { API, generateEvent } from 'protobase'

const eventsPath = "arduinos"
const useChatGPT = true
export const ArduinosAutoAPI = AutoAPI({
    modelName: 'arduinos',
    modelType: ArduinosModel,
    prefix: '/api/v1/',
    skipDatabaseIndexes: true
})

const callModel = async (prompt, context) => {
    let reply;
    if (useChatGPT) {
        reply = await context.chatgpt.chatGPTPrompt({
            message: prompt
        })

        let content = reply[0]

        if (reply.isError) {
            content = "// Error: " + reply.data.error.message
        }

        reply = {
            choices: [
                {
                    message: {
                        content
                    }
                }
            ]
        }
    } else {
        reply = await context.lmstudio.chatWithModel(prompt, 'qwen2.5-coder-32b-instruct')
    }
    return reply
}

export default (app, context) => {
    ArduinosAutoAPI(app, context)

    // const transport = new ProtofySerial({ port: 'COM16', baudRate: 115200 })
    const serialManager = new SerialManager()
    serialManager.startPortScan(2000)
    serialManager.addDevice({ id: 'arduino1', port: 'COM3', baudRate: 115200, autoReconnect: true,})
    serialManager.on('deviceConnected', async (id) => {
        console.log(`Dispositivo ${id} conectado`) 
        generateEvent(
            {
                path: eventsPath+"/connected/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id
                }
            },
            getServiceToken()
        );
    })
    serialManager.on('deviceData', (id, line) => {
        console.log(`Dispositivo ${id} recibió: ${line}`)
        generateEvent(
            {
                path: eventsPath+"/received/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id,
                  data: line
                }
            },
            getServiceToken()
        );
    })
    serialManager.on('deviceError', (id, err) => {
        console.error(`Dispositivo ${id} error: ${err}`)
        generateEvent(
            {
                path: eventsPath+"/error/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id
                }
            },
            getServiceToken()
        );
    })
    serialManager.on('deviceDisconnected', (id, err) => {
        console.error(`Dispositivo ${id} error: ${err}`)
        generateEvent(
            {
                path: eventsPath+"/disconnected/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id
                }
            },
            getServiceToken()
        );
    })


    // transport.startAutoConnect()
    // transport.receiveLine().then((line) => {
    //     console.log('Received line: ', line)
    // }).catch((error) => {
    //     console.error('Error receiving line: ', error)
    // })
    // transport.on('data', (line) => {
    //     console.log('Received data: ', line)
    // })

    app.get('/api/v1/arduinos/connectedDevices', async (req, res) => {
        const connectedDevices = serialManager.getConnectedDevices()
        return res.status(200).json({ connectedDevices })
    })

    app.get('/api/v1/arduinos/:name/disconnect', async (req, res) => {
        const name = req.params.name
        const arduino = ArduinosModel.load({ name })
        if (!arduino) {
            return res.status(404).json({ error: 'Arduino not found' })
        }
        serialManager.disconnectDevice(name)
        return res.status(200).json({ message: 'Disconnected' })
    })

    app.get('/api/v1/arduinos/:name/connect', async (req, res) => {
        const name = req.params.name
        const arduino = ArduinosModel.load({ name })
        if (!arduino) {
            return res.status(404).json({ error: 'Arduino not found' })
        }
        serialManager.connectDevice(name)
        return res.status(200).json({ message: 'Connected' })        
    })

    app.get('/api/v1/arduinos/:name/transport/send/:data', async (req, res) => {
        const name = req.params.name
        const data = req.params.data
        const arduino = ArduinosModel.load({ name })
        if (!arduino) {
            return res.status(404).json({ error: 'Arduino not found' })
        }
        serialManager.sendTo(name, data)
        return res.status(200).json({ message: 'Connected' })        
    })

    app.get('/api/v1/transports/serial/ports/available', async (req, res) => {
        const ports = serialManager.getKnownPorts()
        if (!ports) {
            return res.status(404).json({ error: 'No ports found' })
        }
        return res.status(200).json(Array.from(ports))
    })

    app.post('/api/v1/arduinos/:name/genericPrompt', async (req, res) => { 
        const prompt = req.body.prompt
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' })
        }
        const reply = await callModel(prompt, context)
        return res.status(200).json(reply)
    })

    app.post('/api/v1/arduinos/:name/generateCode', async (req, res) => { 
        const templateName = req.body.templateName
        const rules = req.body.rules
        const physicalRules = req.body.physicalRules
        const transport = req.body.transport
        const agent = {type: "arduino"}

        if (!templateName) {
            return res.status(400).json({ error: 'templateName is required' })
        }
        if(!rules) {
            return res.status(400).json({ error: 'rules is required' })
        }
        if(!physicalRules) {
            return res.status(400).json({ error: 'physicalRules is required' })
        }
        if(!transport) {
            return res.status(400).json({ error: 'transport is required' })
        }
        const transportCodeArduino = (await API.get('/api/v1/transports/serial/arduino'))
        console.log("Transport code: ", transportCodeArduino.data.code)
        const prompt = await context.autopilot.getPromptFromTemplate({ templateName: templateName, agent:agent, rules: rules, physicalRules: physicalRules, transportType: transport.type, transportConfig: JSON.stringify(transport.config), transportCode:transportCodeArduino.data.code });
        console.log("Prompt: ", prompt)
        const reply = await callModel(prompt, context)
        return res.status(200).json(reply)
    })

    app.get('/api/v1/transports/serial/arduino', async (req, res) => {
        return res.status(200).json({
            code: `
             #pragma once
#include <Arduino.h>

class ProtofyWriter {
public:
  virtual void print(const String& msg) = 0;
  virtual void println(const String& msg) {
    print(msg + "\n");
  }
};

class StreamWriter : public ProtofyWriter {
public:
  StreamWriter(Stream& stream) : _stream(stream) {}
  void print(const String& msg) override {
    _stream.print(msg);
  }
private:
  Stream& _stream;
};

typedef void (*ProtofyCallback)(const String* params, size_t count);

#define MAX_CALLBACKS 10

class Protofy {
public:
  Protofy(Stream& stream) : _stream(stream), _writer(new StreamWriter(stream)), _callbackCount(0) {}

  template <typename T>
  void send(const String& deviceName, const String& name, const T& value) {
    _writer->print("PFY->" + deviceName + "->" + name + "->" + String(value) + "\n");
  }

  void on(const char* name, ProtofyCallback cb) {
    if (_callbackCount < MAX_CALLBACKS) {
      _callbacks[_callbackCount].name = name;
      _callbacks[_callbackCount].callback = cb;
      _callbackCount++;
    }
  }

  String loop() {
    String nonProtofy = "";
    while (_stream.available()) {
      char c = _stream.read();
      _inputBuffer += c;

      if (c == '\n') {
        if (_inputBuffer.startsWith("PFY->")) {
          handleProtofyLine(_inputBuffer);
        } else {
          nonProtofy += _inputBuffer;
        }
        _inputBuffer = "";
      }
    }
    return nonProtofy;
  }

private:
  struct CallbackEntry {
    const char* name;
    ProtofyCallback callback;
  };

  CallbackEntry _callbacks[MAX_CALLBACKS];
  uint8_t _callbackCount;
  ProtofyWriter* _writer;
  Stream& _stream;
  String _inputBuffer;

  void handleProtofyLine(const String& line) {
    String tokens[10];
    size_t count = 0;
    int start = 5;

    while (count < 10) {
      int end = line.indexOf("->", start);
      if (end == -1) {
        String last = line.substring(start);
        last.trim();
        tokens[count++] = last;
        break;
      }
      tokens[count++] = line.substring(start, end);
      start = end + 2;
    }

    if (count < 1) return;
    String funcName = tokens[0];

    for (uint8_t i = 0; i < _callbackCount; ++i) {
      if (funcName == _callbacks[i].name) {
        _callbacks[i].callback(&tokens[1], count - 1);
        return;
      }
    }

    _writer->println("Unknown PFY function: " + funcName);
  }
};`
        })
    })
}





