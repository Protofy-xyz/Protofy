import path from 'path'
import { promises as fs } from 'fs'
import * as fspath from 'path';
import { getRoot } from 'protonode'
import { exec } from 'child_process';
import { stderr } from 'process';

const phpApisRoot = (root) => fspath.join(root, "/packages/app/apis/")
// fix: here file var could be populated with ../../../ and it will be a path traversing
const phpApisAbsolutePath = (root, file) => fspath.join(process.cwd(), phpApisRoot(getRoot(root)), file)

export const PhpAPI = (app, context) => {
    const listPhpFiles = async (req) => {
        return (await fs.readdir(phpApisRoot(getRoot(req)))).filter(file => file.split(".")[1] === "php")
    }

    const getPhpFiles = async (req, res, next) => {
        req.phpFiles = (await listPhpFiles(req)).map(file => {
            return {
                basename: file.split('.')[0],
                filename: file,
                path: phpApisAbsolutePath(req, file)
            }
        })
        next()
    }

    // execute some php
    app.get("/api/v1/php", getPhpFiles, async (req, res) => {
        const phpFiles = req.phpFiles
        const { file } = req.query;
        if (!file) {
            return res.status(400).json({ status: "Bad request, php file required" })
        }

        const targetFile = phpFiles.find(phpFile => phpFile.basename === file)
        if (!targetFile) {
            return res.status(400).json({ status: "Bad request, script not found" })
        }

        // sample request 
        exec("php " + targetFile.path, { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing php: ", error)
            }

            if (stderr) {
                console.error("Error executing php: ", stderr)
            }

            res.json({
                stderr,
                stdout
            })
        });
    })

    app.get("/api/v1/phpRaw", getPhpFiles, async (req, res) => {
        const phpFiles = req.phpFiles
        const { file } = req.query;
        if (!file) {
            return res.status(400).json({ status: "Bad request, php file required" })
        }

        console.log("phpFiles: ", phpFiles)
        const targetFile = phpFiles.find(phpFile => phpFile.basename === file)
        if (!targetFile) {
            return res.status(400).json({ status: "Bad request, script not found" })
        }

        // sample request 
        exec("php " + targetFile.path, { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing php: ", error)
            }

            if (stderr) {
                console.error("Error executing php: ", stderr)
                return res.send(stderr)
            }

            res.send(stdout)
        });
    })
}