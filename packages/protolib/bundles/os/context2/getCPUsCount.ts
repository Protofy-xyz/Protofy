import os from 'os';

export const getCPUsCount = async(options: {
    done?: (cpus) => {},
    error?: (err) => {}
}) => {
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const cpusArray = os.cpus();
        const cpus = cpusArray.length;
        done(cpus);  // Return the count of CPUs
        return cpus;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
