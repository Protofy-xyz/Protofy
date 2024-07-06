import { SessionDataType } from "../api/lib/session";
import { ProtoModel } from "./ProtoModel";

export class ProtoCollection<T extends ProtoModel<any>> {
    items: T[]

    constructor(models: T[]) {
        this.items = models;
    }

    getData() {
        return this.items.map(model => model.getData());
    }

    filter(fn: (value: T, index: number, array: T[]) => value is T) {
        return new ProtoCollection<T>(this.items.filter(fn));
    }

    static load<U extends ProtoModel<any>>(data: any[], ModelClass: new (data: any, session?: SessionDataType) => U): ProtoCollection<U> {
        return new ProtoCollection<U>(data.map(itemData => new ModelClass(itemData)));
    }
}