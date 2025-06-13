import os from 'os';

export const getSystemPlatform = async(options: {
    done?: (platform) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const platform = os.platform();
        done(platform);  // Return the system platform
        return platform;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
