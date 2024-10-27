import { API, PendingResult } from "protobase";

export class DeviceRepository {
    async list(): Promise<PendingResult>  {
        return await API.get("/api/core/v1/devices")
    }
}