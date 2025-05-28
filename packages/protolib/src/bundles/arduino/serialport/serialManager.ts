import { EventEmitter } from 'events'
import { ProtofySerial } from './protofySerial';


export interface DeviceConfig {
    id: string;
    port: string;
    baudRate?: number;
    autoReconnect?: boolean;
}

export class SerialManager extends EventEmitter {
    private devices: Map<string, ProtofySerial> = new Map();
    private knownPorts: Set<string> = new Set();
    private scanInterval: NodeJS.Timeout | null = null;

    startPortScan(intervalMs: number = 2000): void {
        if (this.scanInterval) throw new Error('Port scanning already innitiated');
        this.updateKnownPorts(this.knownPorts);
        this.scanInterval = setInterval(async () => {
        // console.log("Escaneo de puertos");
        const ports = await ProtofySerial.listPorts();
        const current = new Set(ports);
        // console.log("Puertos actuales: ", current);
        // Detecta nuevos puertos
        for (const path of current) {
            // console.log("Puerto encontrado: ", path);
            if (!this.knownPorts.has(path)) {
                this.knownPorts.add(path);
                // console.log("Nuevo puerto encontrado: ", path);
                this.emit('portDiscovered', path);
                // Reconecta dispositivos que coincidan
                for (const [id, serial] of this.devices) {
                    // console.log("Reconecting: ", id, serial['portPath'], path);
                    if (serial['portPath'] === path) {
                        serial.connect().catch();
                    }
                }
            }
        }
        // Actualiza knownPorts
        this.knownPorts = current;
        }, intervalMs);
    }

    /** Detiene el escaneo de puertos */
    stopPortScan(): void {
        if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
        }
    }

    /** Añade un dispositivo y, opcionalmente, inicia auto-reconnect */
    addDevice(config: DeviceConfig): void {
        if (this.devices.has(config.id)) {
            throw new Error(`Device ${config.id} ya existe`);
        }
        const serial = new ProtofySerial({port: config.port, baudRate: config.baudRate});
        this.devices.set(config.id, serial);
        // Reemisión de eventos
        serial.on('open', () => this.emit('deviceConnected', config.id));
        serial.on('data', line => this.emit('deviceData', config.id, line));
        serial.on('error', err => this.emit('deviceError', config.id, err));
        serial.on('close', () => this.emit('deviceDisconnected', config.id));
        if (config.autoReconnect) {
            serial.startAutoConnect();
        }
    }

    /** Conecta un dispositivo sin eliminarlo */
    async connectDevice(id: string): Promise<void> {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        await serial.connect();
    }

    /** Desconecta un dispositivo sin eliminarlo (y para auto-reconnect) */
    async disconnectDevice(id: string): Promise<void> {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        await serial.disconnect();
    }

    /** Elimina un dispositivo: desconecta y quita auto-reconnect */
    async removeDevice(id: string): Promise<void> {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        await serial.disconnect();
        this.devices.delete(id);
    }

    getConnectedDevices(): string[] {
        const connected: string[] = [];
        for (const [id, serial] of this.devices.entries()) {
          if (serial.isConnected()) connected.push(id);
        }
        return connected;
      }

    /** Activa auto-reconnect en un dispositivo existente */
    enableAutoReconnect(id: string): void {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        serial.startAutoConnect();
    }

    /** Desactiva auto-reconnect */
    disableAutoReconnect(id: string): void {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        serial.stopAutoConnect();
    }

    /** Envía datos a un dispositivo concreto */
    async sendTo(id: string, data: Buffer | string): Promise<void> {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        await serial.send(data);
    }

    /** Lee una línea de un dispositivo concreto */
    async receiveLineFrom(id: string): Promise<string> {
        const serial = this.devices.get(id);
        if (!serial) throw new Error(`Device ${id} no encontrado`);
        return serial.receiveLine();
    }

    async updateKnownPorts(set: Set<string>): Promise<void> {
         const paths = await ProtofySerial.listPorts();
        for (const p of paths) set.add(p);
    }

    getKnownPorts(): Set<string> {
        return this.knownPorts;
    }
}