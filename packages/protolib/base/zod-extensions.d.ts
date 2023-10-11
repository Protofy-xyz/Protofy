import { ZodString, ZodNumber, ZodBoolean, ZodArray, ZodAny, ZodOptional} from 'zod';

interface ZodExtensions {
    label(caption: string): this;
    hint(hintText: string): this;
    hidden(): this;
    generate(val: any): this;
    before(field: string): this;
    after(field: string): this;
    secret(): this;
    static(): this;
    id(): this;
}

declare module 'zod' {
    interface ZodString extends ZodExtensions {}
    interface ZodNumber extends ZodExtensions {}
    interface ZodBoolean extends ZodExtensions {}
    interface ZodAny extends ZodExtensions {}
    interface ZodOptional extends ZodExtensions {}
}