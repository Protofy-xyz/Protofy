import fs from 'fs/promises';
import { join } from 'path';

export const makeDir = async(options: {
    path: string, 
    done?: (dirPath) => {}, 
    error?: (err) => {}
}) => {
    const path = options.path;
    const done = options.done || (() => {});
    const error = options.error;

    try {
        await fs.mkdir(join('../../', path), { recursive: true });
        done(path)
        return path;
    } catch(err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}