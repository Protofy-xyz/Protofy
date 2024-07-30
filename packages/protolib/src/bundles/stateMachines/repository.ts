import { API, PendingResult } from "protobase";

export class SMDefinitionsRepository {
    static async list(): Promise<[]>  {
        const result = await API.get("/adminapi/v1/statemachinedefinition?all=1")
        return result.data.items
    }
}