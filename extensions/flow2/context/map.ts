import { getLogger } from 'protobase';
import { forEach } from './forEach';

const logger = getLogger();

export const map = async (options: {
    list?: any[],
    mode?: "series" | "manual",
    onMap?: (item, next) => Promise<any>,
    onDone?: (mappedList) => void,
    onError?: (err) => void
}) => {
    const list = options.list || [];
    const mode = options.mode || "series";
    const onMap = options.onMap || (() => { });
    const onDone = options.onDone || (() => { });
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in map");
    });

    const mappedList = [];
    return await forEach({
        list: list,
        mode: mode,
        onEach: async (item, stop, next) => {
            const result = await onMap(item, (val) => {
                if(mode === "manual") {
                    mappedList.push(val);
                    next();
                }
            });

            if(mode === "series") {
                mappedList.push(result);
                next();
            }
        },
        onDone: () => {
            onDone(mappedList)
        },
        onError: onError
    });
}