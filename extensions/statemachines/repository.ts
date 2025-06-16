import { API, PendingResult } from "protobase";

export class SMDefinitionsRepository {
    static async list(): Promise<[]>  {
        const result = await API.get("/api/core/v1/statemachinedefinition?all=1")
        return result.data.items
    }
}

export class SMRepository {
    static async list(): Promise<[]>  {
        const result = await API.get("/api/v1/statemachines?all=1")
        return result.data.items
    }
}