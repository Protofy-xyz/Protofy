import { handler, getServiceToken, AutoAPI, getRoot } from "protonode";
import { API, getLogger } from "protobase";
import * as fs from 'fs';
import { promises } from 'fs';
import fsPath, { relative } from "path";
import { installAsset } from "./assets"
import AdmZip from 'adm-zip';
import { AssetsModel, LOGS_EXTENSION } from "./models/assets";

const root = fsPath.join(process.cwd(), "..", "..");
const logger = getLogger();

const assetsDir = "/data/assets"
const assetsRoot = fsPath.join(root, assetsDir);

if (fs.existsSync(assetsRoot) === false) {
    fs.mkdirSync(assetsRoot, { recursive: true });
}

const decompressZip = async (options) => {
    const { zipPath, outputPath, onlyVento = false, done = () => { }, error } = options;

    try {
        const zip = new AdmZip(zipPath);

        if (!onlyVento) {
            await promises.mkdir(outputPath, { recursive: true });
            zip.extractAllTo(outputPath, true);
            done(outputPath);
            return;
        }

        const entries = zip.getEntries();
        for (const entry of entries) {
            if (!entry.entryName.startsWith(".vento/")) continue;

            const destPath = fsPath.join(outputPath, entry.entryName);

            if (entry.isDirectory) {
                await promises.mkdir(destPath, { recursive: true });
            } else {
                const destDir = fsPath.dirname(destPath);
                await promises.mkdir(destDir, { recursive: true });

                const data = entry.getData();
                await promises.writeFile(destPath, data);
            }
        }

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

const unpackage = async (context, zipFile, options = {}) => {
    const zipPath = fsPath.join(assetsRoot, zipFile);
    const assetName = zipFile.replace(".zip", "");
    const assetPath = fsPath.join(assetsRoot, assetName);

    await decompressZip({
        zipPath,
        outputPath: assetPath,
        done: async (outputPath) => {

            await waitForFolderReady(assetPath);

            const topic = `notifications/assets/${options["onlyVento"] ? "create" : "update"}`
            let payload = ""
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
        ...options
    });
};

const dataDir = (root, ...rest) => fsPath.join(root, "/data/assets/", ...rest)

const isZipFile = (fileName) => fileName.endsWith(".zip");
const isLogsFolder = (fileName) => fileName.endsWith(LOGS_EXTENSION);

const getAssetType = async (fullPath, fileName) => {
    if (isZipFile(fileName)) return "zip";
    if (isLogsFolder(fileName)) return "logs";

    try {
        const stats = await promises.lstat(fullPath);
        if (stats.isDirectory()) return "dir";
    } catch (_) {}
    
    return null;
};

const readAssetMetadata = async (basePath) => {
    const assetJsonPath = fsPath.join(basePath, ".vento", "asset.json");
    const iconPath = fsPath.join(basePath, ".vento", "icon.png");
    const readmePath = fsPath.join(basePath, ".vento", "README.md");

    if (!fs.existsSync(assetJsonPath)) return null;

    let asset = {};

    try {
        const assetJson = JSON.parse(await promises.readFile(assetJsonPath, 'utf8'));
        asset = {
            ...asset,
            ...assetJson,
        }
    } catch (_) {}

    if (fs.existsSync(iconPath)) {
        asset["icon"] = ".vento/icon.png";
    }

    if (fs.existsSync(readmePath)) {
        try {
            asset["readme"] = await promises.readFile(readmePath, 'utf8');
        } catch (_) {}
    }

    return asset;
};

const collectAssetFiles = async (baseDir, assetName) => {
    const fullAssetPath = fsPath.join(baseDir, assetName);
    const assetFiles: any = [];

    const getFilesRecursively = async (dir) => {
        const files = await promises.readdir(dir, { withFileTypes: true });
        for (const f of files) {
            const absPath = fsPath.join(dir, f.name);
            if (f.isDirectory() && !f.name.startsWith('.vento')) {
                await getFilesRecursively(absPath);
            } else if (f.isFile()) {
                assetFiles.push({
                    name: f.name,
                    relativePath: relative(fullAssetPath, absPath),
                });
            }
        }
    };

    await getFilesRecursively(fullAssetPath);
    return assetFiles;
};

const parseAssetEntry = async (fileName, rootPath) => {
    const fullPath = dataDir(rootPath, fileName);
    const type = await getAssetType(fullPath, fileName);
    if (!type) return null;

    const baseName = fileName.replace(/(\.zip|\.logs)$/i, "");

    let asset = {
        name: baseName,
        format: [type],
        assetFiles: [],
    };

    if (type === "dir") {
        const metadata = await readAssetMetadata(fullPath);
        if (!metadata) return null;
        Object.assign(asset, metadata);

        asset.assetFiles = await collectAssetFiles(dataDir(rootPath), baseName);
    }

    return asset;
};

const listAssets = async (rootPath) => {
    const baseDir = dataDir(rootPath);
    const filesAndDirs = await promises.readdir(baseDir);
    const assetsMap = {};

    for (const entry of filesAndDirs) {
        const parsed = await parseAssetEntry(entry, rootPath);
        if (!parsed) continue;

        const name = parsed.name;

        if (!assetsMap[name]) {
            assetsMap[name] = { ...parsed };
        } else {
            assetsMap[name].format = Array.from(new Set([
                ...assetsMap[name].format,
                ...parsed.format,
            ]));

            assetsMap[name].assetFiles.push(...(parsed.assetFiles || []));
        }
    }

    return Object.values(assetsMap);
};


const getDB = (path, req, session) => {

    const db = {
        async *iterator() {
            const rootPath = getRoot(req);
            const assets = await listAssets(rootPath);
            for (const asset of assets) {
                yield [asset.name, JSON.stringify(asset)];
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
            const assets: any[] = await listAssets(rootPath);
            const found = assets.find(asset => asset.name === key);
            return found ? JSON.stringify(found) : null;
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
            if (payload.path == assetsDir && (payload.mimetype == "application/x-zip-compressed" || payload.mimetype == "application/zip")) {
                await unpackage(context, payload.filename, { onlyVento: true });
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
                await unpackage(context, asset + ".zip");
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