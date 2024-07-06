import os from 'os';

export const getFreeMemory = async(options: {
    done?: (freeMemory) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const freeMemory = os.freemem();
        done(freeMemory);  // Return free memory in bytes
        return freeMemory;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
