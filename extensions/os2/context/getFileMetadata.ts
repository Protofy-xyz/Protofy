import fs from 'fs/promises';
import { join } from 'path';

export const getFileMetadata = async(options: {
    path: string,
    done?: (metadata) => {},
    error?: (err) => {}
}) => {
    const filePath = join('../../', options.path);
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const stats = await fs.stat(filePath);
        const metadata = {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        };

        done(metadata);  // Return file metadata
        return metadata;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
