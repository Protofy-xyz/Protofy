import {z} from 'zod'

export const BaseSchema = z.object({
    id: z.string(),
    _deleted: z.boolean().optional(),
})

export function extractFieldDetails(shape): Record<string, any> {
    const fields: Record<string, {type: string, optional: boolean, subtypes: string[], hidden: string[]}> = {};
    for (const key in shape) {
        let field = shape[key];
        let optional = false;
        const checks = field._def.checks
        const hidden = field.hidden
        if (field._def.typeName === 'ZodOptional') {
            optional = true
            field = field._def.innerType;
        }

        if (!field || !field.constructor || !field.constructor.name) {
            console.error("Error processing key:", key, "Field:", field);
            continue;
        }

        fields[key] = {type: field.constructor.name.substr(3), optional: optional, subtypes: checks, hidden}
    }
    return fields;
}

export const hidden = (field, where=['view', 'list', 'add']) => {
    field.hidden = where;
    return field
}