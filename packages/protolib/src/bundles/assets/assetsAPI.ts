import { getAuth, handler, getServiceToken } from "protonode";
import { API, Protofy, getLogger } from "protobase";
import { Application } from "express";
import * as fs from 'fs';
import { promises } from 'fs';
import path from "path";

import AdmZip from 'adm-zip';

const root = path.join(process.cwd(), "..", "..");
const logger = getLogger();


const assetsDir = "data/assets"
const assetsRoot = path.join(root, assetsDir);


function copyFolderStructure(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Source folder "${sourceDir}" does not exist.`);
        return;
    }

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(sourceDir, entry.name);
        const destPath = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            // Create the directory in the destination if it doesn't exist
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyFolderStructure(srcPath, destPath);
        } else if (entry.isFile()) {
            // Copy the file if it doesn't exist in the destination
            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
            } else {
                // If the file already exists, you can choose to skip or overwrite
            }
        }
    }
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

const installAsset = async (context, zipFile) => {
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

                copyFolderStructure(assetPath, root);
            },
            error: (err) => {
                console.error(`Error decompressing ${zipFile}:`, err);
            },
        });
    };

export const AssetsAPI = (app, context) => {

    // on upload file to assets folder, install the asset
    context.onEvent(
        context.mqtt,
        context,
        async (event) => {
            // call the install
            const payload = event.payload || {};
            if (payload.path == assetsDir && payload.mimetype == "application/x-zip-compressed") {
                await installAsset(context, payload.filename);
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
                    message: "assetsContent: ",
                    data: list,
                    level: "info",
                });

                const zipFiles = list.filter((file) =>
                    file.endsWith(".zip")
                );

                for (const zipFile of zipFiles) {
                    await installAsset(context, zipFile);
                }

                list = list.filter(
                    (file) => !file.endsWith(".zip")
                );

                console.log("Assets after decompression:", list);

                for (const asset of list) {
                    copyFolderStructure(root + assetsDir + '/' + asset, root);
                }
            },
        })
        // TODO: return all the installed assets
        res.send({ "result": "All assets installed successfully." });
    }))
}