import { DeviceDefinitionModel } from ".";
import { CreateApi } from '../../../api'

export const DeviceDefinitionsAPI = CreateApi('devicedefinitions', DeviceDefinitionModel, __dirname, '/adminapi/v1/')