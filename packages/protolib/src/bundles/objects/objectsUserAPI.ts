import fs from 'fs';
import path from 'path';
import { z, Schema, BaseSchema, AutoModel } from 'protobase';
import { AutoAPI } from 'protonode'

export const ObjectUserAPI = (app, context) => {
    // list all objects
    if (!fs.existsSync('../../data/objects')) {
        fs.mkdirSync('../../data/objects', { recursive: true });
    }
    const objects = fs.readdirSync('../../data/objects').filter(file => file.endsWith('.json'));
    objects.forEach(file => {
        const filePath = path.join('../../data/objects', file);
        const objectData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (objectData.features && objectData.features.AutoAPI) {
            const schema = Schema.object(Object.keys(objectData.keys).reduce((acc, key) => {
                const element = objectData.keys[key];
                let schema = z;
                if(typeof schema[element.type] !== 'function') {
                    throw new Error(`Type ${element.type} does not exist on z`);
                }
                schema = schema[element.type](...element.params);
                if(element.modifiers) {
                    element.modifiers.forEach(modifier => {
                        const methodName = modifier.name;
                        const params = modifier.params || [];

                        if (typeof schema[methodName] === 'function') {
                            schema = schema[methodName](...params);
                        } else {
                            throw new Error(`Modifier ${methodName} does not exist on z`);
                        }
                    });
                }

                acc[key] = schema;
                return acc;
            }, {}))

            const hasId = Object.keys(BaseSchema.shape).some(key => BaseSchema.shape[key]._def.id)
            const objSchema = Schema.object({
                ...(!hasId ? BaseSchema.shape : {}),
                ...schema.shape
            });

            type objType = z.infer<typeof objSchema>;
            const objModel = AutoModel.createDerived<objType>(objectData.id, objSchema);

            console.log('-------------------------------', {
                modelName: objectData.apiOptions.name,
                modelType: objModel,
                initialData: objectData.initialData,
                prefix: objectData.apiOptions.prefix,
            })
            const ObjectAPI = AutoAPI({
                modelName: objectData.apiOptions.name,
                modelType: objModel,
                initialData: objectData.initialData,
                prefix: objectData.apiOptions.prefix,
            })
            ObjectAPI(app, context)
        }
    });

}