import { handler, getServiceToken, AutoAPI, getRoot } from "protonode";
import { API, getLogger } from "protobase";
import * as fs from 'fs';
import { promises } from 'fs';
import fsPath, { relative } from "path";
import { installAsset } from "./assets"
import AdmZip from 'adm-zip';
import { AssetsModel } from "./models/assets";

const root = fsPath.join(process.cwd(), "..", "..");
const logger = getLogger();

const assetsDir = "/data/assets"
const assetsRoot = fsPath.join(root, assetsDir);

if (fs.existsSync(assetsRoot) === false) {
    fs.mkdirSync(assetsRoot, { recursive: true });
}

const decompressZip = async (options) => {
    const zipPath = options.zipPath;
    const outputPath = options.outputPath;
    const done = options.done || (() => { });
    const error = options.error;

    try {
        const zip = new AdmZip(zipPath);
        await promises.mkdir(outputPath, { recursive: true });
        zip.extractAllTo(outputPath, true);
        done(outputPath);
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const waitForFolderReady = async (folderPath, retries = 10, delay = 200) => {
    for (let i = 0; i < retries; i++) {
        try {
            const contents = await fs.promises.readdir(folderPath);
            if (contents.length > 0) return true;
        } catch (e) {
            // Folder doesn't exist yet
        }
        await sleep(delay);
    }
    throw new Error(`Timeout waiting for folder to be ready: ${folderPath}`);
};

const decompressAndInstallAsset = async (context, zipFile) => {
    const zipPath = fsPath.join(assetsRoot, zipFile);
    const assetName = zipFile.replace(".zip", "");
    const assetPath = fsPath.join(assetsRoot, assetName);

    await decompressZip({
        zipPath,
        outputPath: assetPath,
        done: async (outputPath) => {
            console.log(`Decompressed ${zipFile} to ${outputPath}`);

            await waitForFolderReady(assetPath);

            await context.os2.deleteFile({
                path: `${assetsDir}/${zipFile}`,
            });

            installAsset(assetName)
        },
        error: (err) => {
            console.error(`Error decompressing ${zipFile}:`, err);
        },
    });
};

const unpackage = async (context, zipFile) => {
    const zipPath = fsPath.join(assetsRoot, zipFile);
    const assetName = zipFile.replace(".zip", "");
    const assetPath = fsPath.join(assetsRoot, assetName);

    await decompressZip({
        zipPath,
        outputPath: assetPath,
        done: async (outputPath) => {

            await waitForFolderReady(assetPath);

            const topic = "notifications/assets/create"
            console.log(`Publishing to topic: ${topic}`);
            let payload = ""
            console.log("type of payload: ", typeof (await parseAssetEntry(assetName, getRoot())));
            try {
                payload = JSON.stringify(await parseAssetEntry(assetName, getRoot()))
            } catch (error) {
                console.error(`Error parsing asset entry for ${assetName}:`, error);
            }

            context.mqtt.publish(topic, payload);

        },
        error: (err) => {
            console.error(`Error decompressing ${zipFile}:`, err);
        },
    });
};

const dataDir = (root, ...rest) => fsPath.join(root, "/data/assets/", ...rest)
const joinPath = (...args) => fsPath.join(...args)

const parseAssetEntry = async (fileName, rootPath): Promise<any | null> => {
    const fullPath = dataDir(rootPath, fileName);
    const isZip = fileName.endsWith(".zip");
    const isDir = fs.lstatSync(fullPath).isDirectory();

    if (!isZip && !isDir) return null;

    const asset: any = {
        name: fileName.replace(".zip", ""),
        format: [],
        assetFiles: [],
    };

    if (isDir) {
        const ventoPath = dataDir(rootPath, fileName, ".vento");
        const assetJsonPath = dataDir(rootPath, fileName, ".vento", "asset.json");
        const iconPath = dataDir(rootPath, fileName, ".vento", "icon.png");

        if (!fs.existsSync(ventoPath) || !fs.existsSync(assetJsonPath)) return null;

        try {
            const assetsJsonContent = await promises.readFile(assetJsonPath, 'utf8');
            asset["assetJson"] = JSON.parse(assetsJsonContent);
        } catch (_) { }

        if (fs.existsSync(iconPath)) {
            asset["icon"] = fileName + "/.vento/icon.png";
        }

        const getFilesRecursively = async (dir) => {
            const files = await promises.readdir(dir, { withFileTypes: true });
            for (const f of files) {
                if (f.isDirectory() && !f.name.startsWith('.vento')) {
                    await getFilesRecursively(joinPath(dir, f.name));
                } else if (f.isFile()) {
                    asset.assetFiles.push({
                        name: f.name,
                        relativePath: relative(fullPath, joinPath(dir, f.name)),
                    });
                }
            }
        };
        await getFilesRecursively(fullPath);

        asset.format.push("dir");
    } else {
        asset.format.push("zip");
    }

    return asset;
};


const getDB = (path, req, session) => {
    const isProd = process.env.NODE_ENV === 'production';
    // const envFomat = isProd ? 'css' : 'json';
    const availableFormats = isProd ? ['json', 'css'] : ['json'];

    const db = {
        async *iterator() {
            const rootPath = getRoot(req);
            const baseDir = dataDir(rootPath);

            try {
                await promises.access(baseDir, promises.constants.F_OK);
            } catch {
                await promises.mkdir(baseDir);
            }

            const filesAndDirs = await promises.readdir(baseDir);
            const assetsMap = {};

            for (const file of filesAndDirs) {
                const parsed = await parseAssetEntry(file, rootPath);
                if (!parsed) continue;

                if (!assetsMap[parsed.name]) {
                    assetsMap[parsed.name] = {
                        name: parsed.name,
                        format: [],
                        assetFiles: parsed.assetFiles,
                        ...(parsed.assetJson ? { assetJson: parsed.assetJson } : {}),
                        ...(parsed.icon ? { icon: parsed.icon } : {}),
                    };
                }

                assetsMap[parsed.name].format.push(...parsed.format);
            }

            for (const entry of Object.values(assetsMap)) {
                yield [entry.name, JSON.stringify(entry)];
            }
        },

        async del(key, value) {
            const rootPath = getRoot(req);
            const dir = dataDir(rootPath);

            const zipPath = fsPath.join(dir, `${key}.zip`);
            const folderPath = fsPath.join(dir, key);

            // Delete the zip file if it exists
            try {
                if (fs.existsSync(zipPath)) {
                    await promises.unlink(zipPath);
                    console.log(`Deleted zip: ${zipPath}`);
                }
            } catch (err) {
                console.error(`Error deleting zip file ${zipPath}:`, err);
            }

            // Delete the folder if it exists
            try {
                if (fs.existsSync(folderPath)) {
                    await promises.rm(folderPath, { recursive: true, force: true });
                    console.log(`Deleted folder: ${folderPath}`);
                }
            } catch (err) {
                console.error(`Error deleting folder ${folderPath}:`, err);
            }
        },

        async put(key, value) {
            // const filePath = dataDir(getRoot(req)) + key + ".json"
            // try {
            //     await promises.writeFile(filePath, value)
            // } catch (error) {
            //     console.error("Error creating file: " + filePath, error)
            // }
        },

        async get(key) {
            const rootPath = getRoot(req);
            const baseDir = dataDir(rootPath);
            const filesAndDirs = (await promises.readdir(baseDir)).filter(f => f.startsWith(key));

            const asset = {
                name: key,
                format: [],
                assetFiles: []
            };

            for (const file of filesAndDirs) {
                const parsed = await parseAssetEntry(file, rootPath);
                if (!parsed) continue;

                asset.format.push(...parsed.format);
                asset.assetFiles.push(...(parsed.assetFiles || []));
                if (parsed.assetJson) asset["assetJson"] = parsed.assetJson;
                if (parsed.icon) asset["icon"] = parsed.icon;
            }

            return JSON.stringify(asset);
        }
    };

    return db;
}


export default (app, context) => {

    const AssetsAutoAPI = AutoAPI({
        modelName: 'assets',
        modelType: AssetsModel,
        prefix: '/api/core/v1/',
        dbName: 'assets',
        getDB: getDB,
        requiresAdmin: ['*'],
        notify: (entityModel, action) => {
            context.mqtt.publish(entityModel.getNotificationsTopic(action), entityModel.getNotificationsPayload())
        }
    })

    // on upload file to assets folder, install the asset
    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => {
            // call the install
            const payload = event.payload || {};
            if (payload.path == assetsDir && payload.mimetype == "application/x-zip-compressed") {
                await unpackage(context, payload.filename)
            }

        },
        "files/write/file",
        "core"
    )

    app.get('/api/core/v1/assets/install/all', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        await context.os2.listDir({
            path: assetsDir,
            done: async (list) => {
                await context.logs.log({
                    from: "extensions",
                    name: "assets",
                    message: "assetsContent: ",
                    data: list,
                    level: "info",
                });

                const zipFiles = list.filter((file) =>
                    file.endsWith(".zip")
                );

                for (const zipFile of zipFiles) {
                    await decompressAndInstallAsset(context, zipFile);
                }

                list = list.filter(
                    (file) => !file.endsWith(".zip")
                );

                console.log("Assets after decompression:", list);

                for (const asset of list) {
                    installAsset(asset)
                }
            },
        })
        console.log(`Assets installed.`);
        await API.get("/api/core/v1/reloadBoards?token=" + getServiceToken())
        console.log(`Board reloaded after installing asset.`);
        // TODO: return all the installed assets
        res.send({ "result": "All assets installed successfully." });
    }))

    app.post('/api/core/v1/assets/install', handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const assetsToInstall = req.body.assets || [];

        if (!Array.isArray(assetsToInstall) || assetsToInstall.length === 0) {
            res.status(400).send({ error: "No assets provided for installation." });
            return;
        }

        for (const asset of assetsToInstall) {
            try {
                installAsset(asset)
            } catch (error) {
                console.error(`Error installing asset ${asset}:`, error);
            }
        }

        console.log(`Assets installed.`);
        await API.get("/api/core/v1/reloadBoards?token=" + getServiceToken())
        console.log(`Board reloaded after installing asset.`);

        res.send({ "result": "All assets installed successfully." });
    }))

    AssetsAutoAPI(app, context)
}