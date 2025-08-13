import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { registerDBProvider, ProtoDB } from 'protonode';

const extensionsPath = '../../extensions';

function findModule(baseDir: string): string | null {
    const fullPath = path.join(baseDir, `dbProvider.ts`);
    if (fs.existsSync(fullPath)) return fullPath;
    return null;
}

export default async function loadDBProviders(): Promise<number> {

    const files = fs.readdirSync(extensionsPath);
    let loaded = 0;

    for (const extName of files) {
        const fullPath = findModule(path.join(extensionsPath, extName));
        if (!fullPath) continue;

        try {
            let provider = await import(pathToFileURL(fullPath).href);

            const protoDBs = Object.values(provider).filter((value: any) =>
                typeof value === 'function' && value.prototype && value.prototype instanceof ProtoDB
            );

            if (!protoDBs.length) {
                console.warn(`[dbProviders] ${extName}/dbProvider doesn't export any ProtoDB classes`);
                continue;
            }

            for (const protoDB of protoDBs as any[]) {
                const key = (protoDB.type || extName).toString().toLowerCase();

                registerDBProvider(key, {
                    initDB: (...args: any[]) => protoDB.initDB?.(...args),
                    connect: (...args: any[]) => protoDB.connect?.(...args),
                    closeDBS: () => protoDB.closeDBS?.(),
                });

                console.log(`[dbProviders] Registered protoDB provider '${key}' from ${extName}`);
                loaded++;
            }
        } catch (e) {
            console.error(`[dbProviders] Error loading ${extName}:`, e);
        }
    }

    if (!loaded) console.warn('[dbProviders] No providers registered from extensions');
    return loaded;
}
