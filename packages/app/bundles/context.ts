import machineDefinitions from './stateMachines'
import coreContext from './coreContext'
import fs from 'fs';

const contexts = {
    machineDefinitions: {
        ...machineDefinitions
    },
    ...coreContext,
}

const extensionsPath = '../../extensions';
const folders = fs.readdirSync(extensionsPath);

for (const folder of folders) {
    // Comprobamos si hay context.ts o context.js en dos posibles ubicaciones
    const tryPaths = [
        `@extensions/${folder}/context`,
    ];

    for (const tryPath of tryPaths) {
        try {
            // require falla si el archivo no existe, así que envolvemos
            const mod = require(tryPath);
            console.log(`${tryPath} provides context:`);
            const content = mod.default || mod;
            contexts[folder] = content;
            Object.keys(content).forEach((key) => {
                console.log("\tcontext."+folder+'.'+key)
            });
            break; // si uno carga bien, no seguimos buscando
        } catch (err: any) {
            // Solo ignoramos si es MODULE_NOT_FOUND en ese path
            if (!err.message.includes(tryPath)) {
                console.error(`Error loading ${tryPath}:`, err);
            }
        }
    }
}

export default contexts;