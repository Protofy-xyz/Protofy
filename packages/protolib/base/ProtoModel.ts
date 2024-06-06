import { createSession, SessionDataType } from 'protolib/api/lib/session'
import { ZodObject } from 'protolib/base'
import { ProtoSchema } from './ProtoSchema';
import { getLogger } from "./logger"

const logger = getLogger()

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
    data: any
    session: SessionDataType
    schema: ZodObject<any>
    idField: string
    objectSchema: ProtoSchema
    modelName: string
    indexes: {keys: string[], primary: string}
    groupIndexes: {key: string, fn: Function}[] | []
    constructor(data: any, schema: ZodObject<any>, session?: SessionDataType, modelName?:string) {
        this.data = data;
        this.session = session ?? createSession();
        this.schema = schema
        this.objectSchema = ProtoSchema.load(this.schema)
        this.modelName = modelName?.toLowerCase() ?? 'unknown'
        this.idField = this.objectSchema.is('id').getLast('id') ?? 'id'
        this.indexes = {
            primary: this.idField,
            keys: this.objectSchema.is('indexed').getFields()
        }

        const groupIndexesSchema = this.objectSchema.is('groupIndex')
        const groupIndexes = groupIndexesSchema.getFields()
        this.groupIndexes = groupIndexes.map((field) => {
            return {
                key: field, 
                name: groupIndexesSchema.getFieldKeyDefinition(field, 'groupName') ?? field, 
                fn: groupIndexesSchema.getFieldKeyDefinition(field, 'groupCode')
            }
        })
    }

    get(key: string, defaultValue?) {
        return this.data[key] ?? defaultValue
    }

    static getObjectSchema() {
        return this._newInstance({}).getObjectSchema()
    }

    getObjectSchema() {
        return this.objectSchema
    }

    static getGroupIndexes() {
        return this._newInstance({}).getGroupIndexes()
    }

    getGroupIndexes() {
        return this.groupIndexes
    }

    static getIndexes() {
        return this._newInstance({}).getIndexes()
    }

    getIndexes() {
        return this.indexes
    }

    static getSchemaLinks() {
        return this._newInstance({}).getSchemaLinks()
    }

    getSchemaLinks() {
        return this.objectSchema.is('linkTo').getFields().map((field) => {
            const {linkTo, displayKey, linkToOptions} = this.objectSchema.getFieldDefinition(field)
            return {field, linkTo, displayKey, linkToOptions}
        })
    }

    static getModelName() {
        return this._newInstance({}).getModelName()
    }

    getModelName() {
        return this.modelName
    }

    getLocation() : {lat: string, lon: string} | undefined {
        const locationFields = this.objectSchema.is('location').getFields()
        if (!locationFields.length) {
            throw "Model error: " + this.getModelName() + " doesn't have location information"
        }
        const field = locationFields[0]
        const latKey = this.objectSchema.getFieldKeyDefinition(field, 'latKey')
        const lonKey = this.objectSchema.getFieldKeyDefinition(field, 'lonKey')
        if(!this.data[field]) {
            return
        }

        return {
            lat: this.data[field][latKey],
            lon: this.data[field][lonKey]
        }
    }

    static getIdField() {
        return this.getObjectSchema().is('id').getLast('id') ?? 'id'
    }

    getId() {
        return this.data[this.idField]
    }

    getNotificationsTopic(action: string): string {
        return `notifications/${this.getModelName()}/${action}/${this.getId()}`
    }

    getNotificationsPayload() {
        return this.serialize()
    }

    setId(id: string, newData?): T {
        return new (this.constructor as new (data: any, session?: SessionDataType, modelName?: string) => T)({
            ...(newData ? newData : this.data),
            [this.idField]: id
        }, this.session, this.modelName);
    }

    isVisible(): boolean {
        return true
    }

    list(search?, session?, extraData?, params?): any {
        
        if(params && params.filter) {
            const allFiltersMatch = Object.keys(params.filter).every(key => {
                if(params.filter[key].from || params.filter[key].to) {
                    let valid = true
                    if(params.filter[key].from && this.data && this.data[key] < params.filter[key].from) {
                        valid = false
                    }
    
                    if(params.filter[key].to && this.data && this.data[key] > params.filter[key].to) {
                        valid = false
                    }

                    return valid
                } else {
                    return this.data && this.data[key] == params.filter[key];
                }
            });

            if(!allFiltersMatch) return
        }

        if (search) {
            const { parsed, searchWithoutTags } = parseSearch(search);

            for (const [key, value] of Object.entries(parsed)) {
                if (!this.data.hasOwnProperty(key) || this.data[key] != value) {
                    //logger.debug({ data: this.data[key] }, `discarded: ${JSON.stringify(this.data[key])}`)
                    return
                }
            }

            const searchFields = this.objectSchema.is('search').getFields()
            for (var i = 0; i < searchFields.length; i++) {
                if (((this.data[searchFields[i]] + "").toLowerCase()).includes(searchWithoutTags.toLowerCase())) {
                    return this.read();
                }
            }
        } else {
            return this.read();
        }
    }

    async listTransformed(search?, transformers = {}, session?, extraData?, params?): Promise<any> {
        const result = this.list(search, session, extraData, params)
        if (result) {
            return await (this.getObjectSchema().apply('list', result, transformers));
        }
    }

    create(data?): T {
        const transformed = this.getData(data)
        logger.trace({ transformed }, `Creating object: ${JSON.stringify(transformed)}`)
        return (new (this.constructor as new (data: any, session?: SessionDataType, modelName?: string) => T)(transformed, this.session, this.modelName)).validate();
    }

    async createTransformed(transformers = {}): Promise<T> {
        //loop through fieldDetails keys and find the marked as autogenerate
        const newData = await this.getObjectSchema().apply('create', { ...this.data }, transformers)
        return this.create(newData);
    }

    read(extraData?): any {
        return { ...this.data }
    }

    async readTransformed(transformers = {}, extraData?): Promise<any> {
        const result = await (this.getObjectSchema().apply('read', this.read(extraData), transformers))
        return result;
    }

    update(updatedModel: T, data?: any): T {
        return updatedModel.setId(this.getId(), { ...(data ? data : updatedModel.data) });
    }

    async updateTransformed(updatedModel: T, transformers = {}): Promise<T> {
        const newData = await this.getObjectSchema().apply('update', { ...updatedModel.data }, transformers, { ...this.data })
        return this.update(updatedModel, newData);
    }

    delete(data?): T {
        return new (this.constructor as new (data: any, session?: SessionDataType, modelName?: string) => T)({
            ...(data ? data : this.data)
        }, this.session, this.modelName);
    }

    async deleteTransformed(transformers = {}): Promise<T> {
        const newData = await this.getObjectSchema().apply('delete', { ...this.data }, transformers)
        return this.delete(newData)
    }

    validate(): this {
        this.schema.parse(this.data); //validate
        return this;
    }

    serialize(raw?): string {
        return raw?this.data:JSON.stringify(this.data);
    }

    static linkTo(displayKey?: string | Function, options?:{deleteOnCascade: boolean}) {
        return this._newInstance({}).linkTo(displayKey, options)
    }

    linkTo(displayKey?: string | Function, options?:{deleteOnCascade: boolean}) {
        return this.schema.linkTo(this.constructor, displayKey, options)
    }

    static getApiOptions(): any {
        throw new Error("Derived class must implement getApiOptions");
    }

    protected static _newInstance(data: any, session?: SessionDataType): ProtoModel<any> {
        throw new Error("Derived class must implement _newInstance.");
    }

    static unserialize(data: string, session?: SessionDataType): ProtoModel<any> {
        return this._newInstance(JSON.parse(data), session);
    }

    static getApiEndPoint(): string {
        const options = this.getApiOptions()
        const prefix = options.prefix.endsWith('/') ? options.prefix.slice(0, -1) : options.prefix;
        return prefix + '/' + options.name;
    }

    static load(data: any, session?: SessionDataType): ProtoModel<any> {
        return this._newInstance(data, session);
    }

    getData(data?): any {
        return { ...(this.getObjectSchema().applyGenerators(data ?? this.data)) }
    }
}

export abstract class AutoModel<D> extends ProtoModel<AutoModel<D>> {
    protected static schemaInstance?: ZodObject<any>;

    constructor(data: D, schema: ZodObject<any>, session?: SessionDataType, modelName?: string) {
        super(data, schema, session, modelName);
    }

    protected static _newInstance(data: any, session?: SessionDataType): AutoModel<any> {
        throw new Error("Derived class must implement _newInstance.");
    }

    static createDerived<D>(name: string, schema: ZodObject<any>, apiName?, apiPrefix?) {
        class DerivedModel extends AutoModel<D> {
            constructor(data: D, session?: SessionDataType) {
                super(data, schema, session, name.substring(0, name.length - 5).toLowerCase());
            }

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