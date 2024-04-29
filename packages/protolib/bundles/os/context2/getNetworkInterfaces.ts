import os from 'os';

export const getNetworkInterfaces = async(options: {
    done?: (networkInterfaces) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const networkInterfaces = os.networkInterfaces();
        done(networkInterfaces);  // Return network interfaces information
        return networkInterfaces;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
