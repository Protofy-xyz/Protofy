const writeLocks = new Map();

export async function acquireLock(filePath) {
    while (writeLocks.has(filePath)) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Espera 10ms antes de reintentar
    }
    writeLocks.set(filePath, true);
}

export function releaseLock(filePath) {
    writeLocks.delete(filePath);
}
