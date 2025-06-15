import fs from 'fs/promises';
import { join } from 'path';

export const fileExists = async(options: {
    path: string, 
    done?: (exists: boolean) => {}, 
    error?: (err) => {}
}) => {
    const path = options.path;
    const done = options.done || (() => {});
    const error = options.error;

    try {
        console.log('Checking if file exists');
        await fs.access(join('../../', path), fs.constants.F_OK);
        console.log('File exists');
        done(true);
        return true;
    } catch (err) {
        console.log('File does not exist');
        if (err.code === 'ENOENT') {
            done(false); 
            return false;
        } else if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}