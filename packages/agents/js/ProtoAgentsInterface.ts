import fs from 'fs'
import path from 'path'

export class ProtoAgentInterface {
    constructor() {
        if (this.constructor === ProtoAgentInterface) {
            throw new Error('Cannot instantiate abstract class ProtoAgentInterface');
        }
    }

    configure(subsystems) {
        throw new Error('Method "configure" must be implemented by subclasses');
    }

    configureFromFile(jsonPath) {
        const absPath = path.join(process.cwd(), jsonPath);

        const fileContents = fs.readFileSync(absPath, 'utf8');
        const subsystems = JSON.parse(fileContents);
        return this.configure(subsystems);
    }

    connect(...any) {
        throw new Error('Method "connect" must be implemented by subclasses');
    }

    pubMonitor(subsystemName, monitorName, value) {
        throw new Error('Method "pubMonitor" must be implemented by subclasses');
    }

    handle(subsystemName, actionName, handler) {
        throw new Error('Method "handle" must be implemented by subclasses');
    }
}