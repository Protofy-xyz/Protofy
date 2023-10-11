import { z } from 'zod'

export const BaseSchema = z.object({
    id: z.string(),
    _deleted: z.boolean().optional(),
})

initSchemaSystem()
export const Schema = z

export const hidden = (field, where = ['view', 'list', 'add']) => {
    field.hidden = where;
    return field
}

export const label = (field, caption: string) => {
    field.label = caption;
    return field
}

export const hint = (field, hint: string) => {
    field.hint = hint
}

function extendZodTypePrototype(type: any) {
    type.prototype.label = function (caption: string) {
        this._def.label = caption;
        return this;
    };

    type.prototype.hint = function (hintText: string) {
        this._def.hint = hintText;
        return this;
    };

    type.prototype.hidden = function () {
        this._def.hidden = true;
        return this;
    };

    type.prototype.generate = function (val) {
        this._def.generate = val;
        return this;
    };

    type.prototype.before = function (val) {
        this._def.before = val;
        return this;
    };

    type.prototype.after = function (val) {
        this._def.after = val;
        return this;
    };

    type.prototype.secret = function () {
        this._def.secret = true;
        return this;
    };

    type.prototype.static = function () {
        this._def.static = true;
        return this;
    };
}

// Extiende el prototipo general de todos los tipos de Zod
export function initSchemaSystem() {
    const zodTypes = [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray, z.ZodAny, z.ZodOptional];

    zodTypes.forEach(type => extendZodTypePrototype(type));
}

