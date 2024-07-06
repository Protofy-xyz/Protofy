import os from 'os';

export const getTotalMemory = async(options: {
    done?: (totalMemory) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const totalMemory = os.totalmem();
        done(totalMemory);  // Return total memory in bytes
        return totalMemory;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
