export function isElectron() {
    // Comprobar si window y window.process están definidos
    // y si window.process tiene una propiedad type
    return typeof window !== 'undefined' && typeof window.process === 'object' && window.process['type'] === 'renderer';
}