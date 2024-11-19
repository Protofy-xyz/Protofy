import { API, PendingResult } from "protobase";

export class WledRepository {

    constructor(private ip_address: string) {
        this.ip_address = ip_address;
    }

    async listEffects(): Promise<[]> {
        const response = await API.get(`http://${this.ip_address}/json/effects`)
        const segmentList = response?.data;
        return segmentList
    }

    async listPalettes(): Promise<[]> {
        const response = await API.get(`http://${this.ip_address}/json/palettes`)
        const paletteList = response?.data;
        return paletteList;
    }

    async listSegments(): Promise<[]> {
        const response = await API.get(`http://${this.ip_address}/json/state`)
        const segmentList = response?.data?.seg;
        return segmentList
    }

}