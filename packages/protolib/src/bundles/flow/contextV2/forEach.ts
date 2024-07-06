import { getLogger } from '../../../base/logger';

const logger = getLogger();

export const forEach = async (options: {
    list?: any[],
    mode?: 'parallel' | 'series' | 'manual',
    onEach?: (item, stop?, next?) => Promise<void>,
    onDone?: () => void,
    onError?: (err) => void
}) => {
    const list = options.list || [];
    const mode = options.mode || 'series';
    const onEach = options.onEach || (() => { });
    const onDone = options.onDone || (() => { });
    const onError = options.onError || (() => { });

    try {
        let stopLoop = false; // Flag to indicate if the loops should be stopped

        if (mode === 'parallel') {
            // 'parallel' mode
            await Promise.all(list.map(async (item) => {
                if (!stopLoop) {
                    await onEach(item, () => {
                        stopLoop = true; // Set the flag to stop the loops
                    }, () => { });
                }
            }));
        } else if (mode === 'manual') {
            // 'manual' mode
            for (let i = 0; i < list.length && !stopLoop; i++) {
                const item = list[i];
                await new Promise<void>((resolve, reject) => {
                    onEach(item, () => {
                        stopLoop = true; // Set the flag to stop the loops
                        resolve()
                    }, () => {
                        resolve();
                    });
                });
            }
        } else {
            // 'series' mode (default behavior)
            for (let i = 0; i < list.length && !stopLoop; i++) {
                const item = list[i];
                await onEach(item, () => {
                    stopLoop = true; // Set the flag to stop the loops
                }, () => {});
            }
        }

        await onDone();
    } catch (err) {
        logger.error({ error: err }, "Error in forEach");
        onError(err);
        return;
    }
};