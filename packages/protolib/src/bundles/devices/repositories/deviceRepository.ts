import { API, PendingResult } from "../../../base";

export class DeviceRepository {
    async list(env): Promise<PendingResult>  {
        return await API.get("/adminapi/v1/devices?env="+env)
    }
}