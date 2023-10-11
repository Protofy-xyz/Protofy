import { ZodString, ZodNumber, ZodBoolean, ZodArray, ZodAny} from 'zod';

interface ZodExtensions {
    label(caption: string): this;
    hint(hintText: string): this;
    hidden(): this;
}

declare module 'zod' {
    interface ZodString extends ZodExtensions {}
    interface ZodNumber extends ZodExtensions {}
    interface ZodBoolean extends ZodExtensions {}
    interface ZodAny extends ZodExtensions {}
}