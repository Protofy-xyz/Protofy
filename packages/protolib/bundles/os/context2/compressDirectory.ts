import fs from 'fs';
import archiver from 'archiver';
import { join } from 'path';

export const compressDirectory = async(options: {
    sourcePath: string,
    outputPath: string,
    done?: (path) => {},
    error?: (err) => {}
}) => {
    const sourcePath = join('../../', options.sourcePath);
    var outputPath = join('../../', options.outputPath);
    const done = options.done || (() => {});
    const error = options.error;

    if (!outputPath.endsWith('.zip')) {
        outputPath += '.zip';
    }

    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', () => {
        done(outputPath); // Called when the archive has been finalized and the output file descriptor has closed.
        return outputPath;
    });

    archive.on('error', (err) => {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    });

    archive.pipe(output);
    archive.directory(sourcePath, false);
    await archive.finalize();
}
