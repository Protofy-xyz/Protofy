import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'
import { EventEmitter } from 'events'

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

    static async listPorts(): Promise<string[]> {
        const ports = await SerialPort.list();
        return ports.map(p => p.path);
    }
    constructor(options: ProtofySerialOptions) {
        super();
        this.portPath = options.port;
        this.baudRate = options.baudRate;
    }

    async connect(): Promise<void> {
        if (this.port?.isOpen) return;
        this.port = new SerialPort({ path: this.portPath, baudRate: this.baudRate, autoOpen: false });
        this.parser = this.port.pipe(new ReadlineParser());

        this.parser.on('data', line => this.emit('data', line));
        this.port.on('error', err => this.emit('error', err));
        this.port.on('close', () => this.emit('close',this.portPath));


        await new Promise<void>((resolve, reject) =>
            this.port!.open(err => (err ? reject(err) : resolve()))
        );
        this.emit('open', this.portPath);
    }

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

    async send(data: Buffer | string): Promise<void> {
        if (!this.port || !this.port.isOpen) throw new Error('Port not connected');
        await new Promise<void>((resolve, reject) =>
            this.port!.write(data, err => (err ? reject(err) : resolve()))
        );
    }

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


    startAutoConnect(intervalMs: number = 2000, retryCount: number = 3, retryDelayMs: number = 1000): void {
        if (this.autoInterval) throw new Error('Auto-reconnect already started');
        this.autoInterval = setInterval(() => this.tryConnect(retryCount, retryDelayMs), intervalMs);
    }

    
    stopAutoConnect(): void {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }


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