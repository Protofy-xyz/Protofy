import { generateUuid } from "./uuidGenerator";
import { validateUuid } from "./uuidValidator";
import { versionUuid } from "./uuidVersion";
import { protoQueue } from "./protoQueue";
import { createQueue } from "./queueCreator";
import { enqueueQueue } from "./queueEnqueue";
import { dequeueQueue } from "./queueDequeue";   

export default {
    uuidGenerator: generateUuid,
    uuidValidator: validateUuid,
    uuidVersion: versionUuid,
    queue: protoQueue,
    queueCreator: createQueue,
    queueEnqueue: enqueueQueue,
    queueDequeue: dequeueQueue
}