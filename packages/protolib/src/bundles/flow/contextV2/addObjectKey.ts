import { getLogger } from 'protobase';

const logger = getLogger();

export const addObjectKey = async (options: {
    object?: object,
    key?: string,
    value?: any,
    onDone?: (object) => void,
    onError?: (err) => void
}) => {
    const object = options.object ?? {};
    const key = options.key
    const value = options.value ?? undefined;
    const onDone = options.onDone || ((x) => x);
    const onError = options.onError || ((err) => {
        logger.error({ error: err }, "Error in join");
    });

    try {
        if(key === undefined) {
            throw new Error("Add Object Key: Key is required");
        }
        return onDone({
            ...object,
            [key]: value
        });
    } catch (err) {
        logger.error({ error: err }, "Error in addObjectKey");
        onError(err);
    }
}