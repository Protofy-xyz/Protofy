import os from 'os';

export const getSystemArchitecture = async(options: {
    done?: (architecture) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const architecture = os.arch();
        done(architecture);  // Return the CPU architecture
        return architecture;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
