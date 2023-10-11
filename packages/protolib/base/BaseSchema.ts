import { z } from 'zod'

initSchemaSystem()
export const Schema = z

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

    type.prototype.generate = function (val, force?) {
        this._def.generate = {generator: val, force};
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

    type.prototype.id = function () {
        this._def.id = true;
        return this;
    };
}

// Extiende el prototipo general de todos los tipos de Zod
export function initSchemaSystem() {
    const zodTypes = [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray, z.ZodAny, z.ZodOptional];

    zodTypes.forEach(type => extendZodTypePrototype(type));
}

export const BaseSchema = Schema.object({
    id: z.string().generate(() => ""+Math.random()).id(),
    _deleted: z.boolean().optional(),
})

