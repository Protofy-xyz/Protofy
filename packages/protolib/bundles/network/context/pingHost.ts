import { exec } from 'child_process';
import os from 'os';

export const pingHost = async(options: {
    hostname: string,
    done?: (result) => {},
    error?: (err) => {}
}) => {
    const { hostname, done = () => {}, error = () => {} } = options;
    const isWindows = os.platform() === 'win32';
    const countOption = isWindows ? '' : '-c 4';

    exec(`ping ${countOption} ${hostname}`, (err, stdout, stderr) => {
        console.log('pingHost', err, stdout, stderr);
        if (err) {
            error(err );
            return;
        }
        if (stderr) {
            error(stderr);
            return;
        }
        done(stdout );
    });
}
