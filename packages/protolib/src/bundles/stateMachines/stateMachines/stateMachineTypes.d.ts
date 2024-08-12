import {
    createMachine,
    StateMachine as _xStateMachine,
    EventObject,
    MachineContext,
    Actor,
} from "xstate"

export type xStateMachine = _xStateMachine<
    any, // TContext
    any, // TEvent
    any, // TChildren
    any, // TActor
    any, // TAction
    any, // TGuard
    any, // TDelay
    any, // TStateValue
    any, // TTag
    any, // TInput
    any, // TOutput
    any, // TEmitted
    any  // TMeta
>;

export type MachineActor = null | Actor<any>; 