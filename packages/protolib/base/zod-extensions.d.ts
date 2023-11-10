import { ZodString, ZodNumber, ZodBoolean, ZodArray, ZodAny, ZodOptional, ZodRecord} from 'zod';

interface ZodExtensions {
    label(caption: string): this;
    hint(hintText: string): this;
    display(views?: string[] | undefined): this;
    generate(val: any): this;
    before(field: string): this;
    after(field: string): this;
    dependsOn(field: string): this;
    generateOptions(call: Function): this; 
    choices(fields: string[]): this; 
    secret(): this;
    static(): this;
    id(): this;
    search(): this;
    displayOptions(options:any): this;
    size(size:number): this; //1, 2, 3, 4...
    group(group:number): this;
    name(key:string): this;
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
    interface ZodObject extends ZodExtensions {}
    interface ZodRecord extends ZodExtensions {}
}