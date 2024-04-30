import { getLogger } from '../../../base/logger';
import { forEach } from './forEach';

const logger = getLogger();

export const filter = async (options: {
    list?: any[],
    mode?: "series" | "manual",
    onFilter?: (item, accept, reject) => Promise<any>,
    onDone?: (list) => void,
    onError?: (err) => void
}) => {
    const list = options.list || [];
    const mode = options.mode || "series";
    const onFilter = options.onFilter || (() => { });
    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in filter");
    });

    const filteredList = [];
    return await forEach({
        list: list,
        mode: mode,
        onEach: async (item, stop, next) => {
            let filtered = await onFilter(item, () => {
                filteredList.push(item);
                next()
            }, () => {
                next()
            })
            if(mode == "series") {
                if (filtered) {
                    filteredList.push(item);
                }
                next()
            }
        },
        onDone: () => {
            onDone(filteredList)
        },
        onError: onError
    })
}