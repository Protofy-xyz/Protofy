import fs from 'fs';
import path from 'path';

const extensionsPath = '../../extensions';
const apis: Record<string, any> = {};

async function loadApis() {
    const files = fs.readdirSync(extensionsPath);
    
    await Promise.all(
        files.map(async (extension) => {
            const filePath = path.join(extensionsPath, extension, 'apis');
            if (fs.existsSync(filePath+'.ts')) {
                try {
                    const apiModule = await import('@extensions/'+extension+'/apis');
                    if (typeof apiModule.default === 'function') {
                        apis[extension] = apiModule.default;
                    } else {
                        console.warn(`API module in ${filePath} is not a function`);
                    }
                } catch (error) {
                    console.error(`Error loading API from ${filePath}:`, error);
                }
            }
        })
    );
}

export default async (app, context) => {
    await loadApis();
    Object.keys(apis).forEach((apiName) => {
        try {
            const api = apis[apiName];
            if (typeof api === 'function') {
                console.log(`Initializing API: ${apiName}`);
                api(app, context);
            } else {
                console.warn(`API ${apiName} is not a function`);
            }
        } catch (error) {
            console.error(`Error initializing API ${apiName}:`, error);
        }
    });
}