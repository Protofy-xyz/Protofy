import fse from 'fs-extra'; 
import { join } from 'path';

export const copyDirectory = async(options: {
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
        await fse.copy(join('../../', sourcePath), join('../../', destinationPath), { recursive: true });
        done(destinationPath);  // Directory successfully copied
        return destinationPath;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}