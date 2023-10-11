import { createSession, SessionDataType } from 'protolib/api/lib/session'
import {z} from 'zod'
export abstract class ProtoModel<T extends ProtoModel<T>> {
    data: any;
    session: SessionDataType;
    schema: z.ZodSchema<any>

    constructor(data: any, schema: z.ZodSchema<any>, session?: SessionDataType) {
        this.data = data;
        this.session = session ?? createSession();
        this.schema = schema
    }

    getId() {
        return this.data.id
    }

    setId(id: string): T {
        return new (this.constructor as new (data: any, session?: SessionDataType) => T)({
            ...this.data,
            id: id
        }, this.session);
    }

    generateId(): T {
        return this.setId("" + Math.random());
    }

    isVisible(): boolean {
        return !this.isDeleted();
    }

    isDeleted(): boolean {
        return this.data._deleted ? true : false;
    }

    list(): any {
        return this.read();
    }

    create(): T {
        return this.generateId().validate();
    }

    read(): any {
        return { ...this.data };
    }

    update(updatedModel: T): T {
        return updatedModel.setId(this.getId());
    }

    delete(): T {
        return new (this.constructor as new (data: any, session?: SessionDataType) => T)({
            ...this.data,
            _deleted: true
        }, this.session);
    }

    validate(): this {
        this.schema.parse(this.data); //validate
        return this;
    }

    serialize(): string {
        return JSON.stringify(this.data);
    }

    protected static _newInstance(data: any, session?: SessionDataType): ProtoModel<any> {
        throw new Error("Derived class must implement _newInstance.");
    }

    static unserialize(data: string, session?: SessionDataType): ProtoModel<any> {
        return this._newInstance(JSON.parse(data), session);
    }

    static load(data: any, session?: SessionDataType): ProtoModel<any> {
        return this._newInstance(data, session);
    }

    getData(): any {
        return this.data;
    }
}