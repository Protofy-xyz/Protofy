import { z } from 'zod'

export type FieldDefinitionType = {
    generate: any,
    hint: string,
    label: string,
    name: string,
    type: string,
    optional: boolean,
    subtypes: string[],
    hidden: string[],
    before?: string,
    after?: string,
    secret?:boolean
}

export class ProtoSchema {
    fields: Record<string, FieldDefinitionType> = {};

    constructor(fields: Record<string, FieldDefinitionType>) {
        this.fields = fields
    }

    getFields() {
        return Object.keys(this.fields)
    }

    applyGenerators(data: any) {
        let newData = {...data}
        Object.keys(this.fields).forEach((key) => {
            if(this.fields[key].generate) {
                const gen = this.fields[key].generate;
                if(!data[key] || gen.force) {
                    newData[key] = typeof gen.generator === 'function' ? gen.generator(data) : gen.generator
                }
            }
        })

        return newData;
    }

    //apply generative schema to data
    async apply(eventName:string, data: any, transformers: any, prevData?: any) {
        let newData = {...data}
        const withEvents = this.is('events')
        const keys = Object.keys(withEvents.fields)
        for(var i =0;i<keys.length; i++) {
            const key = keys[i]
            const currField:any = withEvents.fields[key]
            const isNode = typeof process !== 'undefined' && process.versions && process.versions.node
            const events = currField.events.filter(e => e.eventName == eventName && (!e.eventContext || (e.eventContext == 'client' && !isNode) || (e.eventContext == 'server' && isNode)))
            for(var x=0;x < events.length; x++) {
                const e = events[x]
                if(transformers[e.eventHandler]) {
                    newData = await transformers[e.eventHandler](key,e,newData, prevData)
                }
            }
        }

        return newData
    }

    getLayout(num: Number) {
        const elements = [[]]
        let curIndex = 0

        Object.keys(this.fields).forEach((key) => {
            const field = this.fields[key]
            if (elements[curIndex].length == num) {
                elements.push([])
                curIndex++
            }
            elements[curIndex].push(field)
        })
        return elements;
    }

    getFirst(field: string):string|undefined {
        return Object.keys(this.fields).find((key) => {
            if (this.fields[key][field]) {
                return key
            }
        })
    }

    is(field: string) {
        const validFields = {}
        Object.keys(this.fields).forEach((key) => {
            console.log('checkingk key: ', key, 'fields: ', field, 'for object: ', this.fields[key])
            if (this.fields[key][field]) {
                validFields[key] = this.fields[key]
            }
        })
        return new ProtoSchema(validFields)
    }

    isNot(field: string) {
        const validFields = {}
        Object.keys(this.fields).forEach((key) => {
            if (!this.fields[key][field]) {
                validFields[key] = this.fields[key]
            }
        })
        return new ProtoSchema(validFields)
    }

    isAfter(afterField: string) {
        const validFields = {}
        Object.keys(this.fields).forEach((field) => {
            if (this.fields[field].after && this.fields[field].after == afterField) {
                validFields[field] = this.fields[field]
            }
        })
        return new ProtoSchema(validFields)
    }

    isBefore(beforeField: string) {
        const validFields = {}
        Object.keys(this.fields).forEach((field) => {
            if (this.fields[field].before && this.fields[field].before == beforeField) {
                validFields[field] = this.fields[field]
            }
        })
        return new ProtoSchema(validFields)
    }

    merge(schema: ProtoSchema) {
        let newfields: Record<string, FieldDefinitionType> = {}
        Object.keys(this.fields).forEach((key) => {
            const beforeFields = schema.isBefore(key)
            newfields = { ...newfields, ...beforeFields.fields }
            newfields[key] = this.fields[key]
            const afterFields = schema.isAfter(key)
            newfields = { ...newfields, ...afterFields.fields }
        })
        return new ProtoSchema(newfields)
    }

    //generate a protoSchema from a extended zodSchema
    static load(schema: Zod.ZodObject<any>) {
        const fields = {}
        for (const key in schema.shape) {
            let field = schema.shape[key];
            let optional = false;

            const checks = field._def.checks
            const display = field._def.display
            const label = field._def.label
            const hint = field._def.hint
            const generate = field._def.generate
            const before = field._def.before
            const after = field._def.after
            const secret = field._def.secret 
            const id = field._def.id
            const search = field._def.search
            const events = field._def.events
            
            if (field._def.typeName === 'ZodOptional') {
                optional = true
                field = field._def.innerType;
            }

            if (!field || !field.constructor || !field.constructor.name) {
                console.error("Error processing key:", key, "Field:", field);
                continue;
            }

            fields[key] = { generate: generate, hint: hint ?? (label ?? key), label: label ?? key, name: key, type: field.constructor.name.substr(3), optional: optional, subtypes: checks }
            if (before) fields[key].before = before
            if (after) fields[key].after = after
            if (secret) fields[key].secret = secret
            if (id) fields[key].id = id
            if (search) fields[key].search = search
            if (events) fields[key].events = events
            if (display) fields[key].display = display
        }
        return new ProtoSchema(fields)
    }
}