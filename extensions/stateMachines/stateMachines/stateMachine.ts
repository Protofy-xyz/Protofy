import {
    createMachine,
    Actor,
    createActor,
} from "xstate"
import { MachineActor, xStateMachine } from './stateMachineTypes'

export class StateMachine {
    running: boolean
    machine: xStateMachine
    actor: MachineActor
    definition: string

    constructor(running, definition, machine: xStateMachine) {
        this.running = running
        this.definition = definition
        this.machine = machine
    }

    static CreateStateMachine(definitionName, definition): StateMachine {
        try {
            return new StateMachine(false, definitionName,StateMachine.getMachineFromDefinition(definition))
        } catch (e) {
            console.error("Cannot create State Machine from definition: ", e)
            return null
        }
    }

    static getMachineFromDefinition(definition): xStateMachine {
        return createMachine(definition)
    }

    static getActorFromMachine(machine): MachineActor {
        try {
            return createActor(machine)
        } catch (e) {
            console.error("Cannot get actor from machine instance", e)
            return null
        }
    }

    startMachine() {
        if (this.actor) {
            console.log("StateMachine. Machine instance already started")
            return false
        }

        this.actor = StateMachine.getActorFromMachine(this.machine)
        this.actor.start()
        this.running = true
        return true
    }

    stopMachine() {
        if (!this.actor) {
            console.log("StateMachine. Machine instance already stopped")
            return false
        }

        this.actor.stop()
        this.actor = null
        this.running = false
        return true
    }

    emit(emitType: string, data: any) {
        if (!this.actor) {
            console.log("Cannot change machine instance state while it is stopped.")
            return false
        }

        this.actor.send({
            type: emitType,
            ...data
        })
        return true
    }

    inspect() {
        if (!this.actor) {
            return {
                running: false,
                state: "none",
                context: { ...this.machine.config.context }
            }
        }

        const snapshot = this.actor.getSnapshot()
        snapshot.running = true
        snapshot.state = snapshot.value ? snapshot.value.toString() : 'none'

        return snapshot
    }
}