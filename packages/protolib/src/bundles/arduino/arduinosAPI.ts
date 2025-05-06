import { ArduinosModel } from './arduinosSchemas';
import { AutoAPI, handler, getServiceToken } from 'protonode'
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'
import { EventEmitter } from 'events'
import { generateEvent } from "../events/eventsLibrary";

const eventsPath = "arduinos"

export const ArduinosAutoAPI = AutoAPI({
    modelName: 'arduinos',
    modelType: ArduinosModel,
    prefix: '/api/core/v1/',
    skipDatabaseIndexes: true
})

export const ArduinosAPI = (app, context) => {
    ArduinosAutoAPI(app, context)

    // const transport = new ProtofySerial({ port: 'COM16', baudRate: 115200 })
    const serialManager = new SerialManager()
    serialManager.startPortScan(2000)
    serialManager.addDevice({ id: 'arduino1', port: 'COM16', baudRate: 115200, autoReconnect: true })
    serialManager.on('deviceConnected', async (id) => {
        console.log(`Dispositivo ${id} conectado`) 
        generateEvent(
            {
                path: eventsPath+"/connected/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id
                }
            },
            getServiceToken()
        );
    })
    serialManager.on('deviceData', (id, line) => {
        console.log(`Dispositivo ${id} recibió: ${line}`)
        generateEvent(
            {
                path: eventsPath+"/received/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id,
                  data: line
                }
            },
            getServiceToken()
        );
    })
    serialManager.on('deviceError', (id, err) => {
        console.error(`Dispositivo ${id} error: ${err}`)
        generateEvent(
            {
                path: eventsPath+"/error/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id
                }
            },
            getServiceToken()
        );
    })
    serialManager.on('deviceDisconnected', (id, err) => {
        console.error(`Dispositivo ${id} error: ${err}`)
        generateEvent(
            {
                path: eventsPath+"/disconnected/device/"+id,
                from: "devices",
                user: id,
                payload: {
                  id: id
                }
            },
            getServiceToken()
        );
    })


    // transport.startAutoConnect()
    // transport.receiveLine().then((line) => {
    //     console.log('Received line: ', line)
    // }).catch((error) => {
    //     console.error('Error receiving line: ', error)
    // })
    // transport.on('data', (line) => {
    //     console.log('Received data: ', line)
    // })

    app.get('/api/core/v1/arduinos/connectedDevices', async (req, res) => {
        const connectedDevices = serialManager.getConnectedDevices()
        return res.status(200).json({ connectedDevices })
    })

    app.get('/api/core/v1/arduinos/:name/disconnect', async (req, res) => {
        const name = req.params.name
        const arduino = ArduinosModel.load({ name })
        if (!arduino) {
            return res.status(404).json({ error: 'Arduino not found' })
        }
        serialManager.disconnectDevice(name)
        return res.status(200).json({ message: 'Disconnected' })
    })

    app.get('/api/core/v1/arduinos/:name/connect', async (req, res) => {
        const name = req.params.name
        const arduino = ArduinosModel.load({ name })
        if (!arduino) {
            return res.status(404).json({ error: 'Arduino not found' })
        }
        serialManager.connectDevice(name)
        return res.status(200).json({ message: 'Connected' })        
    })
}

interface ProtofySerialOptions {
    port?: string;
    baudRate?: number;
}


/**
 * Clase base que gestiona un único dispositivo serie (Arduino, etc.)
 * con soporte de auto-reintentos y eventos de conexión y datos.
 */
export class ProtofySerial extends EventEmitter {
    private portPath: string;
    private baudRate: number;
    private port: SerialPort | null = null;
    private parser: ReadlineParser | null = null;
    private autoInterval: NodeJS.Timeout | null = null;

    constructor(options: ProtofySerialOptions) {
        super();
        this.portPath = options.port;
        this.baudRate = options.baudRate;
    }

    /** Inicia la conexión con retry y emite 'open' */
    async connect(): Promise<void> {
        if (this.port?.isOpen) return;
        this.port = new SerialPort({ path: this.portPath, baudRate: this.baudRate, autoOpen: false });
        this.parser = this.port.pipe(new ReadlineParser());

        // Reemite datos y errores
        this.parser.on('data', line => this.emit('data', line));
        this.port.on('error', err => this.emit('error', err));
        this.port.on('close', () => this.emit('close',this.portPath));


        await new Promise<void>((resolve, reject) =>
            this.port!.open(err => (err ? reject(err) : resolve()))
        );
        this.emit('open', this.portPath);
    }

    /** Cierra la conexión y limpia listeners */
    async disconnect(): Promise<void> {
        if (this.autoInterval) this.stopAutoConnect();
        if (this.port && this.port.isOpen) {
            await new Promise<void>((resolve, reject) =>
                this.port!.close(err => (err ? reject(err) : resolve()))
            );
        }
        this.parser?.removeAllListeners();
        this.port?.removeAllListeners();
        this.port = null;
        this.parser = null;
    }

    isConnected(): boolean {
        return this.port?.isOpen ?? false;
    }

    /** Envía datos por el puerto */
    async send(data: Buffer | string): Promise<void> {
        if (!this.port || !this.port.isOpen) throw new Error('Puerto no conectado');
        await new Promise<void>((resolve, reject) =>
            this.port!.write(data, err => (err ? reject(err) : resolve()))
        );
    }

    /** Lee la siguiente línea (una sola vez) */
    async receiveLine(): Promise<string> {
        if (!this.port || !this.port.isOpen || !this.parser) {
            await new Promise<void>(resolve => this.once('open', resolve));
        }
        return new Promise<string>((resolve, reject) => {
            const onData = (line: string) => {
                this.parser!.off('data', onData);
                resolve(line);
            };
            const onError = (err: Error) => {
                this.parser!.off('data', onData);
                reject(err);
            };
            this.parser!.once('data', onData);
            this.port!.once('error', onError);
        });
    }

    /**
     * Escanea el puerto periódicamente y se conecta con retry.
     */
    startAutoConnect(intervalMs: number = 2000, retryCount: number = 3, retryDelayMs: number = 1000): void {
        if (this.autoInterval) throw new Error('Auto-reconnect ya iniciado');
        this.autoInterval = setInterval(() => this.tryConnect(retryCount, retryDelayMs), intervalMs);
    }

    /** Detiene el auto-reconnect */
    stopAutoConnect(): void {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }

    /** Intento de conexión con retry */
    private async tryConnect(retryCount: number, retryDelayMs: number): Promise<void> {
        for (let i = 1; i <= retryCount; i++) {
            try {
                await this.connect();
                if (this.autoInterval) this.stopAutoConnect();
                return;
            } catch {
                if (i < retryCount) await new Promise(r => setTimeout(r, retryDelayMs));
            }
        }
    }
}


/**
* Gestor de múltiples dispositivos serie.
* Mantiene una lista de ProtofySerial y reemite eventos con identificación.
*/
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

    /** Inicia escaneo de puertos cada intervalMs y reconexión de dispositivos */
    startPortScan(intervalMs: number = 2000): void {
        if (this.scanInterval) throw new Error('Escaneo de puertos ya iniciado');
        // Inicializa knownPorts
        this.updateKnownPorts(this.knownPorts);
        this.scanInterval = setInterval(async () => {
        const ports = await SerialPort.list();
        const current = new Set(ports.map(p => p.path));
        // Detecta nuevos puertos
        for (const path of current) {
            if (!this.knownPorts.has(path)) {
            this.knownPorts.add(path);
            this.emit('portDiscovered', path);
            // Reconecta dispositivos que coincidan
            for (const [id, serial] of this.devices) {
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
        const ports = await SerialPort.list();
        for (const p of ports) set.add(p.path);
    }
}
