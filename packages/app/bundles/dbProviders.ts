import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { registerDBProvider, ProtoDB, getRoot } from 'protonode';
import * as fspath from 'path';

const extensionsPath = '../../extensions';
const dirPath = fspath.join(getRoot(), "/data/settings/")

function findModule(baseDir: string): string | null {
    const fullPath = path.join(baseDir, `dbProvider.ts`);
    if (fs.existsSync(fullPath)) return fullPath;
    return null;
}

export default async function loadDBProvider(customProvider?: string): Promise<boolean> {
    
    const dbProviderConfigPath = fspath.join(dirPath, 'DB_PROVIDER');
    let providerName: string;

    try {
        const dbProviderConfigContent = await fs.promises.readFile(dbProviderConfigPath, 'utf8');
        providerName = JSON.parse(dbProviderConfigContent)
    } catch {
        providerName = customProvider ?? 'sqlite'; // Default db provider
    }

    const fullPath = findModule(path.join(extensionsPath, providerName));
    if (!fullPath) {
        console.warn(`${providerName}/dbProvider not found`);
        return false;
    }

    try {
        const providerModule = await import(pathToFileURL(fullPath).href);
        const protoDB: any = Object.values(providerModule).find(
            (value: any) => typeof value === 'function' && value.prototype instanceof ProtoDB
        );

        if (!protoDB) {
            console.warn(`${providerName}/dbProvider doesn't export a ProtoDB class`);
            return false;
        }

        registerDBProvider({
            initDB: (...args: any[]) => protoDB.initDB?.(...args),
            connect: (...args: any[]) => protoDB.connect?.(...args),
            closeDBS: () => protoDB.closeDBS?.(),
        });

        return true;
    } catch (e) {
        console.error(`Error loading DB provider ${providerName}:`, e);
        return false;
    }
}
