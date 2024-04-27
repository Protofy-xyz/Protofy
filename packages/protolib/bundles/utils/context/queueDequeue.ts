export async function dequeueQueue(queue) {
    return await queue.dequeue()
}