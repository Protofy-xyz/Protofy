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
    after?: string
}

export class ProtoSchema {
    fields: Record<string, FieldDefinitionType> = {};

    constructor(fields: Record<string, FieldDefinitionType>) {
        this.fields = fields
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
            const hidden = field._def.hidden
            const label = field._def.label
            const hint = field._def.hint
            const generate = field._def.generate
            const before = field._def.before
            const after = field._def.after
            if (field._def.typeName === 'ZodOptional') {
                optional = true
                field = field._def.innerType;
            }

            if (!field || !field.constructor || !field.constructor.name) {
                console.error("Error processing key:", key, "Field:", field);
                continue;
            }

            fields[key] = { generate: generate, hint: hint ?? (label ?? key), label: label ?? key, name: key, type: field.constructor.name.substr(3), optional: optional, subtypes: checks, hidden }
            if (before) fields[key].before = before
            if (after) fields[key].after = after
        }
        return new ProtoSchema(fields)
    }
}