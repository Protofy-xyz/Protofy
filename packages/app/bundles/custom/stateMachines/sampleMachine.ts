import { Protofy } from "protobase";
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { getServiceToken } from "protonode";
import { assign } from "protolib/bundles/stateMachines/handlers";

export default Protofy("machineDefinition", {
    context: {
        count: 0,
    },
    initial: "idle",
    states: {
        idle: {
            on: {
                "CHANGE": "waiting"
            }, 
            entry: async (params) => {
                await generateEvent(
                    {
                        path: "stateMachines/state/entry",
                        from: "state-machine",
                        user: params.instanceName,
                        payload: {
                          machine: params.instanceName, 
                          definition: "sampleMachine", 
                          currentState: "idle"
                        }
                    },
                    getServiceToken()
                );
            }
        },
        waiting: {
            entry: async (params) => {
                await generateEvent(
                    {
                        path: "stateMachines/state/entry",
                        from: "state-machine",
                        user: params.instanceName,
                        payload: {
                          machine: params.instanceName, 
                          definition: "sampleMachine", 
                          currentState: "waiting"
                        }
                    },
                    getServiceToken()
                );
            }
        }
    },
    on: {
        INC: {
        },
        DEC: {
        },
        SET: {
        },
    },
})
