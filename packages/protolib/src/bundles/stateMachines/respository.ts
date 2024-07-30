import { API, PendingResult } from "protobase";

export class SMDefinitionsRepository {
    async list(): Promise<PendingResult>  {
        return await API.get("/adminapi/v1/statemachinedefinition")
    }
}