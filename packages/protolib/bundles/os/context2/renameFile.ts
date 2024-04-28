import fs from 'fs/promises';
import { join } from 'path';

export const renameFile = async(options: {
    oldPath: string, 
    newPath: string, 
    done?: () => {}, 
    error?: (err) => {}
}) => {
    const oldPath = options.oldPath;
    const newPath = options.newPath;
    const done = options.done || (() => {});
    const error = options.error;

    try {
        await fs.rename(join('../../', oldPath), join('../../', newPath));
        done();  // File successfully renamed
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
