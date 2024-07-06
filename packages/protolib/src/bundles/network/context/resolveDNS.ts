import dns from 'dns';
import { promisify } from 'util';

const resolve = promisify(dns.resolve);

export const resolveDNS = async(options: {
    hostname: string,
    rrtype: string,
    done?: (records) => {},
    error?: (err) => {}
}) => {
    const { hostname, rrtype } = options;
    const done = options.done || (() => {});
    const error = options.error;

    try {
        const records = await resolve(hostname, rrtype);
        done(records);  // Return DNS records
        return records;
    } catch (err) {
        if (error) {
            error(err);
        } else {
            throw err;
        }
    }
}
