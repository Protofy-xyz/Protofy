import fs from 'fs/promises';
import { join } from 'path';

export const appendToFile = async(options: {
    path: string,
    content: string,
    line?: boolean,
    done?: (path) => {},
    error?: (err) => {}
}) => {
    const filePath = join('../../', options.path);
    let contentToAppend = options.content;
    const done = options.done || (() => {});
    const error = options.error;

    if (options.line) {
        contentToAppend = '\n' + contentToAppend;
    }

    try {
        await fs.appendFile(filePath, contentToAppend);
        done(filePath);  // Content successfully appended to file
        return filePath;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
