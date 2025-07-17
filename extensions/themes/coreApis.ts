import { ThemeModel } from "./";
import { AutoAPI, getRoot, handler } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API, getServiceToken } from "protobase";


export const dataDir = (root) => fspath.join(root, "/data/themes/")


const getDB = (path, req, session) => {
    const isProd = process.env.NODE_ENV === 'production';
    const envFomat = isProd ? 'css' : 'json';

    const db = {
        async *iterator() {
            // console.log("Iterator")
            try {
                await fs.access(dataDir(getRoot(req)), fs.constants.F_OK)
            } catch (error) {
                console.log("Creating deviceDefinitions folder")
                await fs.mkdir(dataDir(getRoot(req)))
            }
            const files = (await fs.readdir(dataDir(getRoot(req)))).filter(f => {
                const filenameSegments = f.split('.')
                return !fsSync.lstatSync(fspath.join(dataDir(getRoot(req)), f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === envFomat)
            })
            // console.log("Files: ", files)
            for (const file of files) {
                //read file content
                const fileContent = await fs.readFile(dataDir(getRoot(req)) + file, 'utf8')
                const filenameSegments = file.split('.')
                const fileName = filenameSegments.slice(0, -1).join()
                yield [file.name, envFomat == "json" ? fileContent : JSON.stringify({ format: envFomat, name: fileName })];

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
            const filePath = dataDir(getRoot(req)) + key + "." + envFomat
            try {
                await fs.writeFile(filePath, value)
            } catch (error) {
                console.error("Error creating file: " + filePath, error)
            }
        },

        async get(key) {
            const filePath = dataDir(getRoot(req)) + key + "." + envFomat
            try {
                if (envFomat == "json") {
                    const fileContent = await fs.readFile(filePath, 'utf8')
                    return fileContent
                } else {
                    return JSON.stringify({ format: envFomat, name: key })
                }
            } catch (error) {
                throw new Error("File not found")
            }
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

        if (!css && format == "css") { // If css is not provided, is because is prod and css are already generated
            type = "db-css"
        }

        if (css) { // If css is provided, is because is dev and we need to generate the css file
            type = "db-json"
        }

        if (!type) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const token = getServiceToken()
        const updateSettingRes = await API.post(`/api/core/v1/settings/theme?token=${token}`, { name: "theme", value: themeId })

        if (updateSettingRes.isError) {
            const createSettingRes = await API.post(`/api/core/v1/settings?token=${token}`, { name: "theme", value: themeId })
            if (createSettingRes.isError) {
                return res.status(500).json({ error: 'Error updating theme setting' });
            }
        }
        
        const adminPanelThemePath = `${getRoot(req)}/data/public/themes/adminpanel.css`
        const updatedThemeCssPath = dataDir(getRoot(req)) + themeId + ".css"
        
        if (type == "db-json") {
            try {
                await fs.writeFile(updatedThemeCssPath, css)
                await fs.writeFile(adminPanelThemePath, css)
            } catch (error) {
                console.error("Error creating file: ", error)
                return res.status(500).json({ error: 'Error updating CSS' });
            }
        }
        
        if (type == "db-css") {
            // copy the css file to the public folder
            try {
                const cssContent = await fs.readFile(updatedThemeCssPath, 'utf8');
                await fs.writeFile(adminPanelThemePath, cssContent);
            } catch (error) {
                console.error("Error reading or writing CSS file: ", error);
                return res.status(500).json({ error: 'Error updating CSS' });
            }
        }

        return res.status(200).json({ message: 'CSS updated successfully' });
    }))
}