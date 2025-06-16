import { handler } from 'protonode'

const levelTable = {
  '10': 'trace',
  '20': 'debug',
  '30': 'info',
  '40': 'warn',
  '50': 'error',
  '60': 'fatal'
}

export default (app, context) => {
  app.get('/adminapi/v1/logs', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }
    res.send({})
  }))

  const processMessage = async (message, topic) => {
    console.log(`Received message on topic ${topic}:`, message)
    // Process the message as needed
    //logs/api/30 is a topic
    const parts = topic.split('/')
    if (parts.length < 3) {
      console.error('Invalid topic format:', topic)
      return
    }
    const apiId = parts[1] // Extract the API ID from the topic
    const level = levelTable[parts[2]] // Extract the log level from the topic
    let value;
    try {
      value = JSON.parse(message.toString())
      if(value.from && value.from.name && value.from.type) {
        context.state.set({ group: 'logs', tag: value.from.name, name: 'last', value: value, emitEvent: true});
        context.state.append({ group: 'logs', tag: value.from.name, name: level, value: value, emitEvent: true});
      }
    } catch (e) {
      console.error('Failed to parse message as JSON:', e)
      value = message.toString()
    }

    context.state.set({ group: 'logs', tag: apiId, name: 'last', value: value, emitEvent: true});
    context.state.append({ group: 'logs', tag: apiId, name: level, value: value, emitEvent: true});
  }
  context.topicSub(context.mqtt, 'logs/#', (message, topic) => processMessage(message, topic))
}