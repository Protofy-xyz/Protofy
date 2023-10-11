import {z} from 'zod'

export const BaseSchema = z.object({
    id: z.string(),
    _deleted: z.boolean().optional(),
})

initSchemaSystem()
export const ProtoSchema = z

export function extractFieldDetails(shape): Record<string, any> {
    const fields: Record<string, {hint: string,label: string, name: string, type: string, optional: boolean, subtypes: string[], hidden: string[]}> = {};
    for (const key in shape) {
        let field = shape[key];
        let optional = false;

        const checks = field._def.checks
        const hidden = field._def.hidden

        const label = field._def.label
        const hint = field._def.hint
        if (field._def.typeName === 'ZodOptional') {
            optional = true
            field = field._def.innerType;
        }

        if (!field || !field.constructor || !field.constructor.name) {
            console.error("Error processing key:", key, "Field:", field);
            continue;
        }

        fields[key] = {hint: hint??(label??key), label: label?? key, name: key, type: field.constructor.name.substr(3), optional: optional, subtypes: checks, hidden}
    }
    return fields;
}

export const hidden = (field, where=['view', 'list', 'add']) => {
    field.hidden = where;
    return field
}

export const label = (field, caption:string) => {
    field.label = caption;
    return field
}

export const hint = (field, hint: string) => {
    field.hint = hint
}

function extendZodTypePrototype(type: any) {
    type.prototype.label = function(caption: string) {
        console.log('extending: ', this, this._def, caption)
        this._def.label = caption;
        return this;
    };

    type.prototype.hint = function(hintText: string) {
        this._def.hint = hintText;
        return this;
    };

    type.prototype.hidden = function() {
        this._def.hidden = true;
        return this;
    };
}

// Extiende el prototipo general de todos los tipos de Zod
export function initSchemaSystem() {
    const zodTypes = [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray, z.ZodAny, z.ZodOptional];

    zodTypes.forEach(type => extendZodTypePrototype(type));
}

