import { ZodString, ZodNumber, ZodBoolean, ZodArray, ZodAny, ZodOptional} from 'zod';

interface ZodExtensions {
    label(caption: string): this;
    hint(hintText: string): this;
    display(views?: string[] | undefined): this;
    generate(val: any): this;
    before(field: string): this;
    after(field: string): this;
    secret(): this;
    static(): this;
    id(): this;
    search(): this;
    onList(eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?:any): this;
    onCreate(eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?:any): this;
    onRead(eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?:any): this;
    onUpdate(eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?:any): this;
    onDelete(eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?:any): this;
    on(eventName: string, eventHandler: string, eventContext?: 'client' | 'server' | undefined, eventParams?:any): this;
}

declare module 'zod' {
    interface ZodString extends ZodExtensions {}
    interface ZodNumber extends ZodExtensions {}
    interface ZodBoolean extends ZodExtensions {}
    interface ZodAny extends ZodExtensions {}
    interface ZodOptional extends ZodExtensions {}
    interface ZodArray extends ZodExtensions {}
    interface ZodUnion extends ZodExtensions {}
}