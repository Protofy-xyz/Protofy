import os from 'os';

export const getCPUs = async(options: {
    done?: (cpus, cpusCount) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const cpus = os.cpus();
        const cpusCount = cpus.length;
        done(cpus, cpusCount);  // Return the count of CPUs
        return cpus;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
