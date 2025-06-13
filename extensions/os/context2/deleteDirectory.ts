import fs from 'fs/promises';
import { join } from 'path';

export const deleteDirectory = async(options: {
    path: string, 
    done?: () => {}, 
    error?: (err) => {}
}) => {
    const path = options.path;
    const done = options.done || (() => {});
    const error = options.error;

    try {
        await fs.rm(join('../../', path), { recursive: true, force: true });
        done();  // Directory successfully deleted
        return;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
