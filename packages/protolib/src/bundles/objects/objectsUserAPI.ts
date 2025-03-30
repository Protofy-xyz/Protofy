import fs from 'fs';
import path from 'path';
import { z, Schema, BaseSchema, AutoModel } from 'protobase';
import {AutoAPI} from 'protonode'

export const ObjectUserAPI = (app, context) => {
    // list all objects
    if(!fs.existsSync('../../data/objects')) {
        fs.mkdirSync('../../data/objects', { recursive: true });
    }
    const objects = fs.readdirSync('../../data/objects').filter(file => file.endsWith('.json'));
    const models = objects.map(file => {
        const filePath = path.join('../../data/objects', file);
        const objectData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const schema = Schema.object(Object.keys(objectData.shape).reduce((acc, key) => {
            const methodCalls = objectData.shape[key];

            // Start with z
            let schema = z;

            methodCalls.forEach(call => {
                const methodName = call.c;
                const params = call.params || [];

                if (typeof schema[methodName] === 'function') {
                    schema = schema[methodName](...params);
                } else {
                    throw new Error(`Method ${methodName} does not exist on z`);
                }
            });

            acc[key] = schema;
            return acc;
        }, {}))

        const hasId = Object.keys(BaseSchema.shape).some(key => BaseSchema.shape[key]._def.id)
        const objSchema = Schema.object({
            ...(!hasId ? BaseSchema.shape : {}),
            ...schema.shape
        });

        type objType = z.infer<typeof objSchema>;
        const objModel = AutoModel.createDerived<objType>(objectData.name + "Model", objSchema);

        const ObjectAPI = AutoAPI({
            modelName: objectData.name,
            modelType: objModel,
            initialData: {},
            prefix: '/api/v1/'
        })
        ObjectAPI(app, context)
        return objModel;
    });

}