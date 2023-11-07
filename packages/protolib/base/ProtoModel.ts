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
        this.objectSchema = ProtoSchema.load(this.schema)
        this.idField = this.objectSchema.getFirst('id') ?? 'id'
    }

    get(key: string, defaultValue?) {
        return this.data[key] ?? defaultValue
    }

    getObjectSchema() {
        return this.objectSchema
    }

    getId() {
        return this.data[this.idField]
    }

    setId(id: string, newData?): T {
        return new (this.constructor as new (data: any, session?: SessionDataType) => T)({
            ...(newData? newData : this.data),
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
                if(((this.data[searchFields[i]]+"").toLowerCase()).includes(search.toLowerCase())) {
                    return this.read();
                }
            }
        } else {
            return this.read();
        }
    }

    async listTransformed(search?, transformers={}): Promise<any> {
        const result = this.list(search)
        if(result) {
            return await (this.getObjectSchema().apply('list', result, transformers));
        }
    }

    create(data?): T {
        return (new(this.constructor as new (data: any, session?: SessionDataType) => T)({...(this.getObjectSchema().applyGenerators(data?data:this.data))}, this.session)).validate();
    }

    async createTransformed(transformers={}): Promise<T> {
        //loop through fieldDetails keys and find the marked as autogenerate
        const newData = await this.getObjectSchema().apply('create', {...this.data}, transformers)
        return this.create(newData);
    }

    read(): any {
        return {...this.data}
    }

    async readTransformed(transformers={}): Promise<any> {
        const result = await (this.getObjectSchema().apply('read', this.read(), transformers))
        return result;
    }

    update(updatedModel: T, data?:any): T {
        return updatedModel.setId(this.getId(), {...(data ? data : updatedModel.data)});
    }

    async updateTransformed(updatedModel: T, transformers={}): Promise<T> {
        const newData = await this.getObjectSchema().apply('update', {...updatedModel.data}, transformers, {...this.data})
        return this.update(updatedModel, newData);
    }

    delete(data?): T {
        return new (this.constructor as new (data: any, session?: SessionDataType) => T)({
            _deleted: true,
            ...(data ? data : this.data)
        }, this.session);
    }

    async deleteTransformed(transformers={}): Promise<T> {
        const newData = await this.getObjectSchema().apply('delete',{...this.data}, transformers)
        return this.delete(newData)
    }

    validate(): this {
        this.schema.parse(this.data); //validate
        return this;
    }

    serialize(): string {
        return JSON.stringify(this.data);
    }

    static getApiOptions():any {
        throw new Error("Derived class must implement getApiOptions");
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

    static createDerived<D>(name: string, schema: z.ZodObject<any>, apiName?, apiPrefix?) {
        class DerivedModel extends AutoModel<D> {
            constructor(data: D, session?: SessionDataType) {
                super(data, schema, session);
            }

            // Hacemos _newInstance y schemaInstance públicos sólo para esta clase generada
            public static _newInstance(data: any, session?: SessionDataType): AutoModel<any> {
                return new DerivedModel(data, session);
            }

            public static getApiOptions() {
                return {
                    name: apiName,
                    prefix: apiPrefix
                }
            }

            public static schemaInstance = schema;
        }
        
        Object.defineProperty(DerivedModel, 'name', { value: name, writable: false });
        return DerivedModel;
    }
}