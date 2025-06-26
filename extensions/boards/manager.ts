
import { fork } from 'child_process';
import * as path from 'path';

const processes = new Map();

export const Manager = {
    start: (file, state, actions) => {
        if (processes.has(file)) {
            console.warn(`Manager: Process for "${file}" already running.`);
            return;
        }

        const absPath = path.resolve(file);
        const child = fork(absPath, [], {
            windowsHide: true
        });

        // Guardamos el proceso
        processes.set(file, child);

        // Enviar estado inicial
        child.send({ type: 'init', state, actions });

        // Escuchar mensajes del hijo (opcional)
        child.on('message', (msg) => {
            console.log(`[Manager] Message from ${file}:`, msg);
        });

        // Limpieza si el hijo se cierra
        child.on('exit', (code) => {
            console.log(`[Manager] board file ${file} exited with code ${code}`);
            processes.delete(file);
        });
    },

    stop: (file) => {
        const child = processes.get(file);
        if (child) {
            child.kill();
            processes.delete(file);
        } else {
            console.warn(`Manager: No process running for "${file}"`);
        }
    },

    update: (file, state, key) => {
        const child = processes.get(file);
        if (child) {
            child.send({ type: 'update', state, key });
        }
    },

    updateActions: (file, actions) => {
        const child = processes.get(file);
        if (child) {
            child.send({ type: 'updateActions', actions });
        }
    }
};