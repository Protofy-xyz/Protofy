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

    constructor(running, machine: xStateMachine) {
        this.running = running
        this.machine = machine
    }

    static CreateStateMachine(definition): StateMachine {
        try {
            return new StateMachine(false, StateMachine.getMachineFromDefinition(definition))
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
            console.log("Cannot change machine instance state while it is stopped.")
            return null
        }

        return this.actor.getSnapshot()
    }
}