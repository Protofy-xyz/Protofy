import { ThemeModel } from "./";
import ThemeService from "./themeService";
import { AutoAPI, getRoot, handler } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { getServiceToken } from "protobase";

export const dataDir = (root) => fspath.join(root, "/data/themes/")

const copyCssToPublic = async (source, target) => {
    const cssContent = await fs.readFile(source, 'utf8');
    if (!cssContent) {
        return { error: 'CSS content is empty' }
    }
    await fs.writeFile(target, cssContent);
}

const CSS_TARGET_PATH = `${getRoot()}/data/public/themes/adminpanel.css`

const getDB = (path, req, session) => {
    const isProd = process.env.NODE_ENV === 'production';
    const envFomat = isProd ? 'css' : 'json';
    const availableFormats = isProd ? ['json', 'css'] : ['json'];

    const db = {
        async *iterator() {
            try {
                await fs.access(dataDir(getRoot(req)), fs.constants.F_OK)
            } catch (error) {
                console.log("Creating deviceDefinitions folder")
                await fs.mkdir(dataDir(getRoot(req)))
            }

            const fileMap = {};
            const files = (await fs.readdir(dataDir(getRoot(req)))).filter(f => {
                const filenameSegments = f.split('.')
                const currentFormat = filenameSegments[filenameSegments.length - 1]
                return !fsSync.lstatSync(fspath.join(dataDir(getRoot(req)), f)).isDirectory() && availableFormats.includes(currentFormat)
            })

            for (const file of files) {
                const filenameSegments = file.split('.');
                const currentFormat = filenameSegments.pop();
                const fileName = filenameSegments.join('.');

                if (!fileMap[fileName]) {
                    fileMap[fileName] = {
                        name: fileName,
                        format: []
                    };
                }

                if (!fileMap[fileName].format.includes(currentFormat)) {
                    fileMap[fileName].format.push(currentFormat);
                }
            }

            const result: any[] = Object.values(fileMap);

            for (const entry of result) {
                let jsonContent = {};
                if (entry.format.includes('json')) {
                    const fileContent = await fs.readFile(dataDir(getRoot(req)) + entry.name + ".json", 'utf8');
                    jsonContent = JSON.parse(fileContent);
                }
                yield [entry.name, JSON.stringify({ ...entry, ...jsonContent })];
            }
        },

        async del(key, value) {
            const filePath = dataDir(getRoot(req)) + key + "." + envFomat
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.log("Error deleting file: " + filePath)
            }
        },

        async put(key, value) {
            const filePath = dataDir(getRoot(req)) + key + ".json"
            try {
                await fs.writeFile(filePath, value)
            } catch (error) {
                console.error("Error creating file: " + filePath, error)
            }
        },

        async get(key) {
            const dir = dataDir(getRoot(req));
            const formatList: string[] = [];

            for (const format of availableFormats) {
                const filePath = fspath.join(dir, `${key}.${format}`);
                if (fsSync.existsSync(filePath)) {
                    formatList.push(format);
                }
            }

            if (formatList.length === 0) {
                throw new Error("File not found");
            }

            let jsonContent = {};
            if (formatList.includes("json")) {
                const jsonPath = fspath.join(dir, `${key}.json`);
                const fileContent = await fs.readFile(jsonPath, "utf8");
                jsonContent = JSON.parse(fileContent);
            }

            return JSON.stringify({
                name: key,
                format: formatList,
                ...jsonContent
            });
        }
    };

    return db;
}

const ThemesAutoAPI = AutoAPI({
    modelName: 'themes',
    modelType: ThemeModel,
    prefix: '/api/core/v1/',
    dbName: 'themes',
    getDB: getDB,
    requiresAdmin: ['*']
})

export default (app, context) => {
    ThemesAutoAPI(app, context)

    app.post('/api/core/v1/themes/update-css', handler(async (req, res, session) => {

        if (!session || !session.user?.admin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { css, themeId, format } = req.body;

        if (!themeId) {
            return res.status(400).json({ error: 'CSS and themeId are required' });
        }

        let type
        
        if (css && format.includes("json")) { // If css is provided, is because is dev and we need to generate the css file
            type = "css-and-json"
        } else if (!css && format.includes("css")) { // If css is not provided, is because is prod and css are already generated
            type = "only-css-compiled"
        }


        if (!type) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const token = getServiceToken()
        const updateSettingRes = await ThemeService.selectTheme({ themeId: themeId, token: token })

        if (updateSettingRes.isError) {
            return res.status(500).json({ error: 'Error updating theme setting' });
        }

        const updatedThemeCssPath = dataDir(getRoot(req)) + themeId + ".css"

        if (type == "css-and-json") {
            try {
                await fs.writeFile(updatedThemeCssPath, css)
                await fs.writeFile(CSS_TARGET_PATH, css)
            } catch (error) {
                console.error("Error creating file: ", error)
                return res.status(500).json({ error: 'Error updating CSS' });
            }
        }

        if (type == "only-css-compiled") {
            // copy the css file to the public folder
            try {
                const copyRes = await copyCssToPublic(updatedThemeCssPath, CSS_TARGET_PATH);
                if (copyRes?.error) {
                    return res.status(500).json({ error: copyRes.error });
                }
            } catch (error) {
                console.error("Error reading or writing CSS file: ", error);
                return res.status(500).json({ error: 'Error updating CSS' });
            }
        }

        return res.status(200).json({ message: 'CSS updated successfully' });
    }))
}