import { createSession, SessionDataType } from 'protolib/api/lib/session'
import {z} from 'zod'
import { ProtoSchema } from './ProtoSchema';

export abstract class ProtoModel<T extends ProtoModel<T>> {
    data: any;
    session: SessionDataType;
    schema: z.ZodObject<any>
    idField: string
    objectSchema: ProtoSchema
    constructor(data: any, schema: z.ZodObject<any>, session?: SessionDataType) {
        this.data = data;
        this.session = session ?? createSession();
        this.schema = schema
        this.objectSchema = this.getObjectSchema()
        this.idField = this.objectSchema.getFirst('id') ?? 'id'

    }

    getObjectSchema() {
        return ProtoSchema.load(this.schema)
    }

    getId() {
        return this.data[this.idField]
    }

    setId(id: string): T {
        return new (this.constructor as new (data: any, session?: SessionDataType) => T)({
            ...this.data,
            [this.idField]: id
        }, this.session);
    }

    isVisible(): boolean {
        return !this.isDeleted();
    }

    isDeleted(): boolean {
        return this.data._deleted ? true : false;
    }

    list(search?): any {
        if(search) {
            const searchFields = this.objectSchema.is('search').getFields()
            for(var i=0;i<searchFields.length;i++) {
                if((this.data[searchFields[i]]+"").includes(search)) {
                    return this.read();
                }
            }
        } else {
            return this.read();
        }
    }

    create(): T {
        //loop through fieldDetails keys and find the marked as autogenerate
        const newData = this.getObjectSchema().apply(this.data)
        return (new(this.constructor as new (data: any, session?: SessionDataType) => T)(newData, this.session)).validate();
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

export abstract class AutoModel<D> extends ProtoModel<AutoModel<D>> {
    protected static schemaInstance?: z.ZodObject<any>;

    constructor(data: D, schema: z.ZodObject<any>, session?: SessionDataType) {
        super(data, schema, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): AutoModel<any> {
        throw new Error("Derived class must implement _newInstance.");
    }

    static createDerived<D>(name: string, schema: z.ZodObject<any>) {
        class DerivedModel extends AutoModel<D> {
            constructor(data: D, session?: SessionDataType) {
                super(data, schema, session);
            }

            // Hacemos _newInstance y schemaInstance públicos sólo para esta clase generada
            public static _newInstance(data: any, session?: SessionDataType): AutoModel<any> {
                return new DerivedModel(data, session);
            }

            public static schemaInstance = schema;
        }
        
        Object.defineProperty(DerivedModel, 'name', { value: name, writable: false });
        return DerivedModel;
    }
}