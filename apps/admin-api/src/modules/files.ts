
import { promises as fs } from 'fs';
import { constants } from 'fs';
import path from 'path';
import {app} from 'protolib/api';

const PROJECT_WORKSPACE_DIR = "../../"; // Define where the workspace root dir is

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

    const filepath = path.join(PROJECT_WORKSPACE_DIR, name);

    if(! await fileExists(filepath)) {
        res.status(404).send('No such file or directory: '+filepath)
        return
    }
    if (((await fs.stat(filepath)).isDirectory())) {
        try {
            const fileList = await fs.readdir(filepath);

            res.send(await Promise.all(fileList.map(async (f) => {
                const filePath = path.join(filepath, f);
                const stats = await fs.stat(filePath);

                return {
                    id: Math.random(),
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
            console.log('send file: ', filepath, path.resolve(filepath))
            res.status(200).sendFile(path.resolve(filepath), { dotfiles: 'allow' }, (err) => {
                if (err) {
                  console.error('Error al enviar el archivo:', err);
                  res.status(err.status || 500).send('Error al enviar el archivo');
                }
              });
        } catch (e) {
            console.error('Error reading file: ', e)
            res.status(500).send(`Failed to serve the file at path '${name}'`);
        }
    }
};

//received post requests and creates directories or write files, dependeing on query string param
//the content of the file is readed from req.body
//the path to the file to write/directory to create, is extracted from req.params[0]
//if path is /a/b/c, a and b should exist to create c
const handleFilesWriteRequest = async (req, res) => {
    const name = req.params.path || '';
    const filepath = path.join(PROJECT_WORKSPACE_DIR, name);

    if (req.query.dir === 'true') { // Check if the query contains ?dir=true
        try {
            await fs.mkdir(filepath, { recursive: true }); // Create the directory
            res.status(200).send(`Directory '${name}' created successfully.`);
        } catch (e) {
            console.error('Error creating directory: ', e);
            res.status(501).send(`Error creating directory: '${name}'`);
        }
    } else {
        // write the file
        try {
            const content = req.body; // Extract the content from the post request
            await fs.writeFile(filepath, content); // Write content to file
            res.status(200).send(`File at path '${name}' written successfully.`);
        } catch (e) {
            console.error('Error writing file: ', e);
            res.status(500).send(`Failed to write the file at path '${name}'`);
        }
    }
};

// Route to write files or create directories directly in /adminapi/v1/files
app.post('/adminapi/v1/files', handleFilesWriteRequest);

// Route to write files or create directories in /adminapi/v1/files/*
app.post('/adminapi/v1/files/:path(*)', handleFilesWriteRequest);

// Route for /adminapi/v1/files
app.get('/adminapi/v1/files', handleFilesRequest);

// Route for /adminapi/v1/files/*
app.get('/adminapi/v1/files/:path(*)', handleFilesRequest);




