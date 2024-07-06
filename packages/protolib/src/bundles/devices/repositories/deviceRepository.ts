import { API, PendingResult } from "protobase";

export class DeviceRepository {
    async list(env): Promise<PendingResult>  {
        return await API.get("/adminapi/v1/devices?env="+env)
    }
}