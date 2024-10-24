import { API, PendingResult } from "protobase";

export class DeviceRepository {
    async list(env): Promise<PendingResult>  {
        return await API.get("/api/core/v1/devices?env="+env)
    }
}