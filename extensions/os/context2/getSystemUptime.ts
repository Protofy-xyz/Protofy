import os from 'os';

export const getSystemUptime = async(options: {
    done?: (uptime) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const uptime = os.uptime();
        done(uptime);  // Return system uptime in seconds
        return uptime;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
