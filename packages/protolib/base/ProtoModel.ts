import { createSession, SessionDataType } from 'protolib/api/lib/session'
import {ZodObject} from 'protolib/base'
import { ProtoSchema } from './ProtoSchema';

function parseSearch(search) {
    const regex = /(\w+):("[^"]+"|\S+)/g;
    const parsed = {};
    let match;
    let searchWithoutTags = search;

    while ((match = regex.exec(search)) !== null) {
        const key = match[1].toLowerCase();
        const value = match[2].replace(/"/g, '').toLowerCase();

        parsed[key] = value;

        searchWithoutTags = searchWithoutTags.replace(match[0], '');
    }


    searchWithoutTags = searchWithoutTags.trim();

    return { parsed, searchWithoutTags };
}

export abstract class ProtoModel<T extends ProtoModel<T>> {
    data: any;
    session: SessionDataType;
    schema: ZodObject<any>
    idField: string
    objectSchema: ProtoSchema
    constructor(data: any, schema: ZodObject<any>, session?: SessionDataType) {
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

    list(search?, session?, extraData?): any {
        if(search) {
            const { parsed, searchWithoutTags } = parseSearch(search);

            for (const [key, value] of Object.entries(parsed)) {
                if (!this.data.hasOwnProperty(key) || this.data[key] != value) {
                    console.log('discarded: ', this.data[key])
                    return
                }
            }

            const searchFields = this.objectSchema.is('search').getFields()
            for(var i=0;i<searchFields.length;i++) {
                if(((this.data[searchFields[i]]+"").toLowerCase()).includes(searchWithoutTags.toLowerCase())) {
                    return this.read();
                }
            }
        } else {
            return this.read();
        }
    }

    async listTransformed(search?, transformers={}, session?, extraData?): Promise<any> {
        const result = this.list(search, session, extraData)
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

    read(extraData?): any {
        return {...this.data}
    }

    async readTransformed(transformers={}, extraData?): Promise<any> {
        const result = await (this.getObjectSchema().apply('read', this.read(extraData), transformers))
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

    static sort(elements:any[], orderBy, orderDirection) {
        return elements.sort((a, b) => {
            if (a[orderBy] > b[orderBy]) return orderDirection === 'asc' ? 1 : -1;
            if (a[orderBy] < b[orderBy]) return orderDirection === 'asc' ? -1 : 1;
            return 0;
        });
    }

    getData(): any {
        return this.data;
    }
}

export abstract class AutoModel<D> extends ProtoModel<AutoModel<D>> {
    protected static schemaInstance?: ZodObject<any>;

    constructor(data: D, schema: ZodObject<any>, session?: SessionDataType) {
        super(data, schema, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): AutoModel<any> {
        throw new Error("Derived class must implement _newInstance.");
    }

    static createDerived<D>(name: string, schema: ZodObject<any>, apiName?, apiPrefix?) {
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