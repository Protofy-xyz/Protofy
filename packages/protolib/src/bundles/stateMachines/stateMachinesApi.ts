import path from 'path'
import { promises as fs } from 'fs'
import { getRoot } from 'protonode'
import { StateMachine } from './stateMachine'

export const StateMachinesAPI = (app, context) => {
  const runtimeMachines: { [key: string]: StateMachine } = {}
  const machineDefinitions = context.machineDefinitions

  const checkMachineInstanceName = (req, res, next) => {
    if (!runtimeMachines[req.params.instanceName]) {
      return res.status(404).json({ status: "Machine instance not found" })
    }

    next()
  }

  // list instances
  app.get("/adminapi/v1/statemachines", async (req, res) => {
    return res.status(200).json({ status: "Ok", machines: Object.keys(runtimeMachines) })
  })

  // get instance
  app.get("/adminapi/v1/statemachines/:instanceName", checkMachineInstanceName, async (req, res) => {
    return res.status(200).json({ status: "Ok", [req.params.instanceName]: runtimeMachines[req.params.instanceName] })
  })

  // start and stop instance
  app.get("/adminapi/v1/statemachines/:instanceName/start", checkMachineInstanceName, async (req, res) => {
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

  app.get("/adminapi/v1/statemachines/:instanceName/stop", checkMachineInstanceName, async (req, res) => {
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
  app.get("/adminapi/v1/statemachines/:instanceName/emit", checkMachineInstanceName, async (req, res) => {
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
  app.get("/adminapi/v1/statemachines/:instanceName/inspect", checkMachineInstanceName, async (req, res) => {
    const instanceName = req.params.instanceName

    try {
      const machineInspectionData = runtimeMachines[instanceName].inspect()
      if (machineInspectionData) {
        return res.status(200).json({ status: "Ok", [instanceName]: machineInspectionData })
      } else {
        return res.status(400).json({ status: "Machine instance is not started", [instanceName]: runtimeMachines[instanceName] })
      }
    } catch (e) {
      console.error("Cannot inspect machine instance")
      return res.status(500).json({ status: "Cannot inspect machine instance" })
    }
  })

  // generate machine instance from definition
  app.get("/adminapi/v1/statemachines/:definitionName/:instanceName", async (req, res) => {
    const { definitionName, instanceName } = req.params
    if (!machineDefinitions[definitionName]) {
      return res.status(404).json({ status: "Machine definition not found" })
    }

    const machine = StateMachine.CreateStateMachine(machineDefinitions[definitionName])
    if (!machine) {
      return res
        .status(500)
        .json({ status: "Cannot create machine from the '" + definitionName + "' machine definition" })
    }

    runtimeMachines[instanceName] = machine
    res.status(200).json({ status: "Ok" })
  })
}