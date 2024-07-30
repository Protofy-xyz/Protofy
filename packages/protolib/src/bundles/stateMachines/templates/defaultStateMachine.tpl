import { Protofy } from 'protobase'
import { generateEvent } from "protolib/bundles/events/eventsLibrary";
import { getServiceToken } from "protonode";

export default Protofy("machineDefinition", {
  context: {{{machineContext}}}, 
  states: {
  {{#each machineStates}}
    {{this}}: {
      entry: async () => {
        await generateEvent(
          {
              path: "stateMachines/state/entry",
              from: "state-machine",
              user: "{{../machineName}}",
              payload: {
                machine: "{{../machineName}}", 
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

