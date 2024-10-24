
import { promises as fs } from 'fs';
import { constants } from 'fs';
import path from 'path';
import { getApp, getServiceToken } from 'protonode';
import multer from 'multer';
import fsExtra from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { getRoot, handler } from 'protonode';
import { getLogger, API } from 'protobase';
import archiver from 'archiver';

const logger = getLogger()
const app = getApp()

const generateEvent = async (event, token='') => {
    try {
        await API.post('/api/core/v1/events?token='+token, event, undefined, true)
    } catch(e) {
        //console.error("Failed to send event: ", e)
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const destPath = path.join(process.cwd()+ '/' +getRoot(req), req.params.path);
        await fsExtra.ensureDir(destPath);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

async function fileExists(filePath) {
    try {
        await fs.access(filePath, constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

// Handler function to avoid repeating the same code for both routes
const handleFilesRequest = async (req, res) => {
    const name = req.params.path || '';
    const isDownload = req.query.download

    const filepath = path.join(getRoot(req), name);

    if (! await fileExists(filepath)) {
        res.status(404).send('No such file or directory: ' + filepath)
        return
    }
    if (((await fs.stat(filepath)).isDirectory())) {
        if (isDownload) {
            try {
                // TODO compressDirectory is not working, it should be fixed
                // compressDirectory({ sourcePath: filepath, outputPath: path.basename(filepath) })

                const archive = archiver('zip', {
                    zlib: { level: 9 }
                });
                res.setHeader('Content-Disposition', 'attachment; filename=' + path.basename(filepath) + '.zip');
                res.setHeader('Content-Type', 'application/zip');
                archive.on('error', (err) => {
                    throw err;
                });
                await archive.pipe(res);
                await archive.directory(filepath, false);
                await archive.finalize();

            } catch (e) { console.error('Error, could not ZIP file', e) }
        }

        try {
            const fileList = await fs.readdir(filepath);

            res.send(await Promise.all(fileList.map(async (f) => {
                const filePath = path.join(filepath, f);
                const stats = await fs.stat(filePath);

                return {
                    id: uuidv4(),
                    path: `${name}/${f}`,
                    isHidden: f.startsWith('.'),
                    name: f,
                    size: stats.size,
                    modDate: stats.mtime,
                    isDir: stats.isDirectory()
                };
            })));
        } catch (e) {
            res.status(501).send(`The path '${name}' is not a directory`);
        }
    } else {
        // Serving the file:
        try {
            // // Using 'mime' package to determine content type based on file extension
            // const contentType = mime.lookup(filepath)
            // if (contentType) {
            //     res.setHeader('Content-Type', contentType);
            // }
            logger.debug({ filepath, resolvedPath: path.resolve(filepath) }, `send file: ${filepath} ${path.resolve(filepath)}`)
            if (isDownload) {
                // Establece el encabezado para forzar la descarga
                res.setHeader('Content-Disposition', 'attachment; filename='+name);
            }
            res.status(200).sendFile(path.resolve(filepath), { dotfiles: 'allow' }, (error) => {
                if (error) {
                    logger.error({ error }, "Error sending file");
                    res.status(error.status || 500).send("Error sending file")
                }
            });
        } catch (error) {
            logger.error({ error }, "Error reading file")
            res.status(500).send(`Failed to serve the file at path '${name}'`);
        }
    }
};

//received post requests and creates directories or write files, dependeing on query string param
//the content of the file is readed from req.body
//the path to the file to write/directory to create, is extracted from req.params[0]
//if path is /a/b/c, a and b should exist to create c
const handleFilesWriteRequest = async (req, res, session) => {
    const name = req.params.path || '';
    const filepath = path.join(getRoot(req), name);
    if (req.body && req.body.hasOwnProperty && req.body.hasOwnProperty("content")) {
        await fs.writeFile(filepath, req.body.content)
    }

    generateEvent({
        path: 'files/write/file', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
        from: 'core', // system entity where the event was generated (next, api, cmd...)
        user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
        payload: {'path': name} // event payload, event-specific data
    }, getServiceToken())
    res.status(200).send({result: "uploaded"});
};

const handleDirectoryCreateRequest = async (req, res, session) => {
    const name = req.params.path || '';

    const dirPath = path.join(getRoot(req), name);
    try {
        await fs.mkdir(dirPath, { recursive: true }); // recursive: true permite crear directorios anidados si no existen
        generateEvent({
            path: 'files/create/dir',
            from: 'core',
            user: session.user.id, // Actualiza según corresponda
            payload: { 'path': name }
        }, getServiceToken());
        res.status(200).send({ result: "directory created" });
    } catch (error) {
        logger.error({ error }, "Error creating directory")
        res.status(500).send({ error: "Error creating directory" });
    }
};

const handleDeleteRequest = async (req, res, session) => {
    const basePath = req.params.path || '';
    const itemsToDelete = req.body;

    if (!itemsToDelete || !itemsToDelete.length) {
        return res.status(400).send({ error: "No items provided for deletion" });
    }
    try {
        for (const item of itemsToDelete) {
            const itemPath = path.join(getRoot(req), basePath, item.name);
            if (item.isDirectory) {
                await fs.rm(itemPath, { recursive: true, force: true }); // Delete directories
                generateEvent({
                    path: 'files/delete/dir',
                    from: 'core',
                    user: session.user.id,
                    payload: { 'path': path.join(basePath, item.name) }
                }, getServiceToken());
            } else {
                await fs.unlink(itemPath); // Delete files
                generateEvent({
                    path: 'files/delete/file',
                    from: 'core',
                    user: session.user.id,
                    payload: { 'path': path.join(basePath, item.name) }
                }, getServiceToken());
            }
        }
        res.status(200).send({ result: "Items deleted" });
    } catch (error) {
        logger.error({ error }, "Error deleting items")
        res.status(500).send({ error: "Error deleting items" });
    }
};

const handleRenameRequest = async (req, res, session) => {
    const { currentPath, newName } = req.body;

    if (!currentPath || !newName) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    const oldPath = path.join(getRoot(req), currentPath);
    const newPath = path.join(getRoot(req), path.dirname(currentPath), newName);

    try {
        await fs.rename(oldPath, newPath);
        generateEvent({
            path: 'files/rename',
            from: 'core',
            user: session.user.id,
            payload: { 'oldPath': currentPath, 'newPath': newName }
        }, getServiceToken());

        res.status(200).send({ result: "Item renamed successfully" });
    } catch (error) {
        logger.error({ error }, "Error renaming item")
        res.status(500).send({ error: "Error renaming item" });
    }
};


const requireAdmin = () => handler(async (req, res, session, next) => {
    if(!session || !session.user.admin) {
        res.status(401).send({error: "Unauthorized"})
        return
    }
    next()
})


//Route to delete files and directories
app.post('/api/core/v1/deleteItems/:path(*)', requireAdmin(), handler(handleDeleteRequest));

// Route to write files or create directories directly in /api/core/v1/files
app.post('/api/core/v1/files', requireAdmin(), upload.single('file'), handler(handleFilesWriteRequest));
// Route to write files or create directories in /api/core/v1/files/*
app.post('/api/core/v1/files/:path(*)', requireAdmin(), upload.single('file'), handler(handleFilesWriteRequest));
// Route to create directories in /api/core/v1/directories/*
app.post('/api/core/v1/directories/:path(*)', requireAdmin(), handler(handleDirectoryCreateRequest));

app.get('/api/core/v1/files/:path(*)', requireAdmin(), handler(handleFilesRequest));

app.post('/api/core/v1/renameItem', requireAdmin(), handler(handleRenameRequest));

export default 'files'