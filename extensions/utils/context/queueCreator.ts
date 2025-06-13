import { protoQueue } from "./protoQueue";

export function createQueue(type, onItemEnqueued, onItemDequeued, onQueueEmpty) {
    const queue = new protoQueue(type)
    if (onItemEnqueued) queue.on('itemEnqueued', onItemEnqueued)
    if (onItemDequeued) queue.on('itemDequeued', onItemDequeued)
    if (onQueueEmpty) queue.on('queueEmpty', onQueueEmpty)
    return queue
}