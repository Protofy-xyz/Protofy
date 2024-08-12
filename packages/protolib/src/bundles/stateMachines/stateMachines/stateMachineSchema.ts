import { AutoModel, Schema, z } from 'protobase'
import { StateMachineDefinitionModel } from '../stateMachineDefinitions/stateMachineDefinitionSchema';

export const StateMachineSchema = Schema.object({
    name: Schema.string().id().static(),
    definition: StateMachineDefinitionModel.linkTo((data) => data.name).hint("Select your machine definition"),
})

export type StateMachineType = z.infer<typeof StateMachineSchema>;
export const StateMachineModel = AutoModel.createDerived<StateMachineType>("ObjectModel", StateMachineSchema);