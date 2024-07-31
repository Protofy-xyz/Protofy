import path from 'path'
import { promises as fs } from 'fs'
import { getRoot } from 'protonode'
import { StateMachine } from './stateMachine'
import { AutoAPI } from 'protonode'
import { StateMachineModel } from './stateMachineSchema'

export const StateMachinesAPI = (app, context) => {
  const runtimeMachines: { [key: string]: StateMachine } = {}
  const machineDefinitions = context.machineDefinitions

  const getDB = (path, req, session) => {
    const db = {
      async *iterator() {
        for (let i = 0; i < Object.keys(runtimeMachines).length; i++) {
          const instanceName = Object.keys(runtimeMachines).sort()[i] // sort to guarantee order
          let instanceData = {}

          try {
            instanceData = runtimeMachines[instanceName].inspect()
          } catch (e) {
            console.error("Error getting machine instances: ", e)
          }

          yield [instanceName, JSON.stringify({
            name: instanceName,
            ...instanceData
          })]
        }
      },

      async del(key, value) {

      },

      async put(key, value) {
        // manually handled 
      },

      async get(key) {
      }
    };

    return db;
  }

  const checkMachineInstanceName = (req, res, next) => {
    if (!runtimeMachines[req.params.instanceName]) {
      return res.status(404).json({ status: "Machine instance not found" })
    }

    next()
  }

  const autoAPI = AutoAPI({
    modelName: 'statemachines',
    modelType: StateMachineModel,
    prefix: '/api/v1/',
    getDB: getDB,
    connectDB: () => new Promise(resolve => resolve(null)),
    requiresAdmin: ['*'],
    useEventEnvironment: false,
    useDatabaseEnvironment: false
  })
  autoAPI(app, context)

  // start and stop instance
  app.get("/api/v1/statemachines/:instanceName/start", checkMachineInstanceName, async (req, res) => {
    const instanceName = req.params.instanceName
    try {
      if (runtimeMachines[instanceName].startMachine()) {
        return res.status(200).json({ status: "Machine instance started", [instanceName]: runtimeMachines[instanceName] })
      } else {
        return res.status(200).json({ status: "Machine instance already started", [instanceName]: runtimeMachines[instanceName] })
      }
    } catch (e) {
      console.error("Cannot start machine instance")
      return res.status(500).json({ status: "Cannot start machine instance" })
    }
  })

  app.get("/api/v1/statemachines/:instanceName/stop", checkMachineInstanceName, async (req, res) => {
    const instanceName = req.params.instanceName
    try {
      if (runtimeMachines[instanceName].stopMachine()) {
        return res.status(200).json({ status: "Machine instance stopped", [instanceName]: runtimeMachines[instanceName] })
      } else {
        return res.status(200).json({ status: "Machine instance already stopped", [instanceName]: runtimeMachines[instanceName] })
      }
    } catch (e) {
      console.error("Cannot stop machine instance")
      return res.status(500).json({ status: "Cannot stop machine instance" })
    }
  })

  // change instance state
  app.post("/api/v1/statemachines/:instanceName/emit", checkMachineInstanceName, async (req, res) => {
    const instanceName = req.params.instanceName
    const { emitType, payload } = req.body ?? {}

    if (!emitType) {
      return res.status(400).json({ status: "Bad request. Required emitType." })
    }

    try {
      if (runtimeMachines[instanceName].emit(emitType, payload ?? {})) {
        return res.status(200).json({ status: "Machine message emitted", [instanceName]: runtimeMachines[instanceName] })
      } else {
        return res.status(400).json({ status: "Machine instance is not started", [instanceName]: runtimeMachines[instanceName] })
      }
    } catch (e) {
      console.error("Cannot emit message to machine instance")
      return res.status(500).json({ status: "Cannot emit message to machine instance" })
    }
  })

  // debugging options
  app.get("/api/v1/statemachines/:instanceName", checkMachineInstanceName, async (req, res) => {
    const instanceName = req.params.instanceName

    try {
      const machineInspectionData = runtimeMachines[instanceName].inspect()
      return res.status(200).json(machineInspectionData)
    } catch (e) {
      console.error("Cannot inspect machine instance")
      return res.status(500).json({ status: "Cannot inspect machine instance" })
    }
  })

  // generate machine instance from definition
  app.post("/api/v1/statemachines", async (req, res) => {
    console.log('BODY: ', req.body)
    const {name, definition} = req.body

    if (!name || !definition) {
      return res.status(400).json({status: "Bad request. Missing params name or definition."})
    }

    if (!machineDefinitions[definition.name]) {
      return res.status(404).json({ status: "Machine definition not found" })
    }

    const newStates = {}
    Object.keys(machineDefinitions[definition.name].states).forEach(stateName => {
        const overridedFunctionKeys = ["entry"]
        const modifiedState = machineDefinitions[definition.name].states[stateName]

        overridedFunctionKeys.forEach(funcKey => {
            const oldFunction = modifiedState[funcKey]
            modifiedState[funcKey] = () => oldFunction({ // params for definition state functions
              instanceName: name 
            })
        })

        newStates[stateName] = modifiedState
    })

    const instanceDefinition = {
        ...machineDefinitions[definition.name],
        context: {
            ...machineDefinitions[definition.name].context,
            _name: name
        },
        states: newStates
    }

    const machine = StateMachine.CreateStateMachine(definition.name, instanceDefinition)
    if (!machine) {
      return res
        .status(500)
        .json({ status: "Cannot create machine from the '" + definition.name + "' machine definition" })
    }

    runtimeMachines[name] = machine

    try {
        if (runtimeMachines[name].startMachine()) {
            res.status(200).json(req.body)
        } else {
            return res.status(500).json({ status: "Cannot start machine instance" })
        }
    } catch (e) {
        console.error("Cannot start machine instance")
        return res.status(500).json({ status: "Cannot start machine instance" })
    }

  })
}