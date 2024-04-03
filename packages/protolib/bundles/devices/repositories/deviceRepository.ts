import { API, PendingResult } from "../../../base";

export class DeviceRepository {
    async list(): Promise<PendingResult>  {
        return await API.get("/adminapi/v1/devices")
    }
}