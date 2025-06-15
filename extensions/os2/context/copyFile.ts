import fs from 'fs/promises';
import { join } from 'path';

export const copyFile = async(options: {
    sourcePath: string,
    destinationPath: string,
    done?: (path) => {},
    error?: (err) => {}
}) => {
    const sourcePath = options.sourcePath;
    const destinationPath = options.destinationPath;
    const done = options.done || (() => {});
    const error = options.error;

    try {
        await fs.copyFile(join('../../', sourcePath), join('../../', destinationPath));
        done(destinationPath);  // File successfully copied
        return destinationPath;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
