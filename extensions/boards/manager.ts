
import { fork } from 'child_process';
import * as path from 'path';
import { watch } from 'chokidar';


const processes = new Map();

export const Manager = {
    start: async (file, boardId, getStates, getActions) => {
        const states = await getStates();
        const actions = await getActions();
        if (processes.has(file)) {
            if (processes.get(file).killed) {
                processes.delete(file);
            } else {
                console.warn(`Manager: Process for "${file}" already running.`);
                return false;
            }
        }

        const absPath = path.resolve(file);
        const child = fork(absPath, [], {
            windowsHide: true
        });

        // Guardamos el proceso
        processes.set(file, child);

        // Enviar estado inicial
        child.send({ type: 'init', states, actions, boardId});

        // Escuchar mensajes del hijo (opcional)
        child.on('message', (msg) => {
            console.log(`[Manager] Message from ${file}:`, msg);
        });

        // Limpieza si el hijo se cierra
        child.on('exit', (code) => {
            console.log(`[Manager] board file ${file} exited with code ${code}`);
            processes.delete(file);
        });

        //set watcher for file changes
        let timer = null;
        watch(file, { persistent: true, ignoreInitial: true })
            .on('change', (changedFile) => {
                console.log(`[Manager] File changed: ${changedFile}`);
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    Manager.stop(file);
                    Manager.start(file, boardId, getStates, getActions);
                }, 1000);

            })
            .on('error', (error) => {
                console.error(`[Manager] Error watching file ${file}:`, error);
            });

        return true
    },

    stop: (file) => {
        const child = processes.get(file);
        if (child) {
            processes.delete(file);
            child.kill();
            //remove watcher
            watch(file).close();
            return true
        } else {
            return false
        }
    },

    update: (file, states, key) => {
        const child = processes.get(file);
        if (child) {
            child.send({ type: 'update', states, key });
        }
    },

    updateActions: (file, actions) => {
        const child = processes.get(file);
        if (child) {
            child.send({ type: 'updateActions', actions });
        }
    }
};