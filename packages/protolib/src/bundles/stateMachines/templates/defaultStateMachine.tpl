import { Protofy } from 'protobase'
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { getServiceToken } from "protonode";

export default Protofy("machineDefinition", {
  context: {{{machineContext}}}, 
  initial: "{{machineInitialState}}", 
  states: {
  {{#each machineStates}}
    {{this}}: {
      entry: async (params) => {
        await generateEvent(
          {
              path: "stateMachines/state/entry",
              from: "state-machine",
              user: params.instanceName,
              payload: {
                machine: params.instanceName, 
                definition: "{{../machineName}}", 
                currentState: "{{this}}"
              }
          },
          getServiceToken()
        );
      }
    }, 
  {{/each}}
  }
})

