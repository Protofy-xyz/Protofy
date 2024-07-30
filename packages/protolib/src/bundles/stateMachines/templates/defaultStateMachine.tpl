import { Protofy } from 'protobase'

export default Protofy("machineDefinition", {
  context: {{{machineContext}}}, 
  state: {
  {{#each machineStates}}
    {{this}}: {
      entry: () => {
        // generate event
      }
    }, 
  {{/each}}
  }
})

