import { ArduinosModel } from './arduinosSchemas';
import { AutoAPI, handler, getServiceToken, getDeviceToken } from 'protonode'
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'
import { EventEmitter } from 'events'

export const ArduinosAutoAPI = AutoAPI({
    modelName: 'arduinos',
    modelType: ArduinosModel,
    prefix: '/api/core/v1/',
    skipDatabaseIndexes: true
})

export const ArduinosAPI = (app, context) => {
    ArduinosAutoAPI(app, context)

    const transport = new ProtofySerial({ port: 'COM16', baudRate: 115200 })
    transport.startAutoConnect('COM16', 2000)
    transport.receiveLine().then((line) => {
        console.log('Received line: ', line)
    }).catch((error) => {
        console.error('Error receiving line: ', error)
    })
    transport.on('data', (line) => {
        console.log('Received data: ', line)
    })

}

interface ProtofySerialOptions {
    port?: string;
    baudRate?: number;
  }
  
  
class ProtofySerial extends EventEmitter {
    private portPath: string | null;
    private baudRate: number;
    private port: SerialPort | null = null;
    private parser: ReadlineParser | null = null;
    private autoInterval: NodeJS.Timeout | null = null;
  
    constructor(options: ProtofySerialOptions = {}) {
      super();
      this.portPath = options.port ?? null;
      this.baudRate = options.baudRate ?? 115200;
    }
  
    async connect(): Promise<void> {
      if (this.port?.isOpen) return;
      if (!this.portPath) {
        throw new Error('No se ha especificado ningún puerto');
      }
  
      this.port = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
        autoOpen: false,
      });
  
      this.parser = this.port.pipe(new ReadlineParser());
  

      this.parser.on('data', (line: string) => this.emit('data', line));
      this.port.on('error', (err: Error) => this.emit('error', err));
  
      await new Promise<void>((resolve, reject) =>
        this.port!.open(err => (err ? reject(err) : resolve()))
      );
  
      this.emit('open');
      console.log(`Conectado a ${this.portPath} @ ${this.baudRate}bps`);
    }
  
    async disconnect(): Promise<void> {
      if (this.port && this.port.isOpen) {
        await new Promise<void>((resolve, reject) =>
          this.port!.close(err => (err ? reject(err) : resolve()))
        );
        console.log(`Desconectado de ${this.portPath}`);
        this.port = null;
        this.parser = null;
      }
    }
  

    async send(data: Buffer | string): Promise<void> {
      if (!this.port || !this.port.isOpen) {
        throw new Error('Puerto no conectado');
      }
      await new Promise<void>((resolve, reject) =>
        this.port!.write(data, err => (err ? reject(err) : resolve()))
      );
    }
  
    async receiveLine(): Promise<string> {
      if (!this.port || !this.parser || !this.port.isOpen) {
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
  
    startAutoConnect(
      portName: string,
      intervalMs: number = 2000,
      retryCount: number = 3,
      retryDelayMs: number = 1000
    ): void {
      if (this.autoInterval) {
        throw new Error('Auto-conexión ya iniciada');
      }
      this.portPath = portName;
  
      this.autoInterval = setInterval(() => {
        this.attemptAutoConnect(portName, retryCount, retryDelayMs).catch(err =>
          console.error('Error en auto-conexión:', err)
        );
      }, intervalMs);
  
      console.log(
        `Auto-conexión iniciada: buscando ${portName} cada ${intervalMs}ms con ${retryCount} reintentos`
      );
    }
  
    stopAutoConnect(): void {
      if (this.autoInterval) {
        clearInterval(this.autoInterval);
        this.autoInterval = null;
        console.log('Auto-conexión detenida');
      }
    }
  
    private async attemptAutoConnect(
      portName: string,
      retryCount: number,
      retryDelayMs: number
    ): Promise<void> {
      const ports = await SerialPort.list();
      if (!ports.some(p => p.path === portName)) {
        return;
      }
  
      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          await this.connect();
          console.log(`Auto-conexión exitosa en intento ${attempt}`);
          this.stopAutoConnect();
          return;
        } catch (err) {
          console.error(
            `Intento ${attempt}/${retryCount} fallido:`,
            (err as Error).message
          );
          if (attempt < retryCount) {
            await this.delay(retryDelayMs);
          }
        }
      }
  
      console.warn(
        `Se agotaron los ${retryCount} reintentos sin éxito. Volviendo a escanear...`
      );
    }
  
    private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
  