import { getAuth, handler, getServiceToken } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import { Application } from "express";
import * as fs from 'fs';
import { promises } from 'fs';
import path from "path";
import {installAsset} from "./assets"
import AdmZip from 'adm-zip';
import { c } from "tar";

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();


const assetsDir = "/data/assets"
const assetsRoot = path.join(root, assetsDir);

if(fs.existsSync(assetsRoot) === false) {
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
    const zipPath = path.join(assetsRoot, zipFile);
    const assetName = zipFile.replace(".zip", "");
    const assetPath = path.join(assetsRoot, assetName);

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
    const zipPath = path.join(assetsRoot, zipFile);
    const assetName = zipFile.replace(".zip", "");
    const assetPath = path.join(assetsRoot, assetName);

    await decompressZip({
        zipPath,
        outputPath: assetPath,
        done: async (outputPath) => {
            console.log(`Decompressed ${zipFile} to ${outputPath}`);

            await waitForFolderReady(assetPath);

            // await context.os2.deleteFile({
            //     path: `${assetsDir}/${zipFile}`,
            // });
        },
        error: (err) => {
            console.error(`Error decompressing ${zipFile}:`, err);
        },
    });
};

export default (app, context) => {

    // on upload file to assets folder, install the asset
    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => {
            // call the install
            const payload = event.payload || {};
            if (payload.path == assetsDir && payload.mimetype == "application/x-zip-compressed") {
                // await decompressAndInstallAsset(context, payload.filename);
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
        await API.get("/api/core/v1/reloadBoards?token=" +getServiceToken())
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
            try{
                installAsset(asset)
            } catch (error) {
                console.error(`Error installing asset ${asset}:`, error);
            }
        }

        console.log(`Assets installed.`);
        await API.get("/api/core/v1/reloadBoards?token=" +getServiceToken())
        console.log(`Board reloaded after installing asset.`);

        res.send({ "result": "All assets installed successfully." });
    }))
}