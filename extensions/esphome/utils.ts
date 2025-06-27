import { Transport, ESPLoader } from "protodevice/src/device/esptool-js";
import { sleep } from "protodevice/src/sleep";
import { Build, FlashError } from "protodevice/src/const";
import { manifest } from "protodevice/src/manifest";


export let port;

export const resetTransport = async (transport: Transport) => {
    await transport.device.setSignals({
        dataTerminalReady: false,
        requestToSend: true,
    });
    await transport.device.setSignals({
        dataTerminalReady: false,
        requestToSend: false,
    });
};

export const closeSerialPort = async () => {
    if (port) {
        try {
            await port.close();
        } catch (err: any) {
            console.error("Error closing port:", err);
        }
        port = null;
    }
}

export function downloadLogs(logs) {

    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'device-logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const resetDevice = async (): Promise<void> => {
    if (!port) {
        console.error("No port available to reset device.");
        return;
    }
    const transport = new Transport(port);
    await resetTransport(transport);
};

export const connectSerialPort = async (): Promise<{ port: any | null, error?: string }> => {
    try {
        port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 115200 });
        return { port };
    } catch (err: any) {
        console.error("dev: Error opening port:", err);
        if (err.name === "NotFoundError") {
            return { port: null, error: "Any port selected" };
        }
        return { port: null, error: "Couldn't open port, verify connection and drivers" };
    }
};

export const flash = async (cb: (data: any) => void, deviceName: string, compileSessionId: string, eraseBeforeFlash: boolean) => {
    if (!port) {
        cb({ message: "Invalid port", details: { error: FlashError.PORT_UNAVAILABLE } });
        return;
    }

    cb({ message: 'Please hold "Boot" button of your ESP32 board.' });

    const transport = new Transport(port);
    const esploader = new ESPLoader(transport, 115200, undefined as any);

    // For debugging
    (window as any).esploader = esploader;

    try {
        await port.close(); // esptool-js abrirá el puerto internamente
        await esploader.main_fn();
    } catch (err: any) {
        console.error("Fail in main_fn():", err);
        cb({
            message: "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.",
            details: { error: FlashError.FAILED_INITIALIZING, details: err },
        });
        await resetTransport(transport);
        await transport.disconnect();
        return;
    }

    const chipFamily = esploader.chip.CHIP_NAME as Build["chipFamily"];
    console.log("chipFamily:", chipFamily);

    if (!esploader.chip.ROM_TEXT) {
        cb({
            message: `Chip ${chipFamily} is not supported`,
            details: { error: FlashError.NOT_SUPPORTED, details: `Chip ${chipFamily} is not supported` },
        });
        await resetTransport(transport);
        await transport.disconnect();
        return;
    }

    cb({ message: `Initialized. Found ${chipFamily}`, details: { done: true } });

    const build = manifest.builds.find((b) => b.chipFamily === chipFamily);
    if (!build) {
        cb({
            message: `Your ${chipFamily} board is not supported.`,
            details: { error: FlashError.NOT_SUPPORTED, details: chipFamily },
        });
        await resetTransport(transport);
        await transport.disconnect();
        return;
    }

    cb({ message: "Preparing installation...", details: { done: false } });

    const fileArray: Array<{ data: string; address: number }> = [];
    let totalSize = 0;

    try {
        const filePromises = build.parts.map(async (part) => {
            const url = downloadDeviceFirmwareEndpoint(deviceName, compileSessionId);
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Downloading firmware ${url} failed: ${resp.status}`);
            const blob = await resp.blob();

            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsBinaryString(blob);
            });
        });

        const results = await Promise.all(filePromises);
        results.forEach((data, i) => {
            fileArray.push({ data, address: build.parts[i].offset });
            totalSize += data.length;
        });

        cb({ message: "Installation prepared", details: { done: true } });
    } catch (err: any) {
        cb({
            message: err.message,
            details: { error: FlashError.FAILED_FIRMWARE_DOWNLOAD, details: err.message },
        });
        await resetTransport(transport);
        await transport.disconnect();
        return;
    }

    if (eraseBeforeFlash) {
        cb({ message: "Erasing device...", details: { done: false } });
        await esploader.erase_flash();
        cb({ message: "Device erased", details: { done: true } });
    }

    cb({
        message: `Writing progress: 0%`,
        details: { bytesTotal: totalSize, bytesWritten: 0, percentage: 0 },
    });

    let totalWritten = 0;

    try {
        await esploader.write_flash(
            fileArray,
            "keep",
            "keep",
            "keep",
            false,
            true,
            (fileIndex: number, written: number, total: number) => {
                const uncompressedWritten = (written / total) * fileArray[fileIndex].data.length;
                const newPct = Math.floor(((totalWritten + uncompressedWritten) / totalSize) * 100);

                if (written === total) {
                    totalWritten += uncompressedWritten;
                    return;
                }

                cb({
                    message: `Writing progress: ${newPct}%`,
                    details: { bytesTotal: totalSize, bytesWritten: totalWritten + written, percentage: newPct },
                });
            }
        );
    } catch (err: any) {
        cb({
            message: err.message,
            details: { error: FlashError.WRITE_FAILED, details: err },
        });
        await resetTransport(transport);
        await transport.disconnect();
        return;
    }

    cb({
        message: "Writing complete",
        details: { bytesTotal: totalSize, bytesWritten: totalWritten, percentage: 100 },
    });

    await sleep(100);

    console.log("HARD RESET");
    await resetTransport(transport);

    console.log("DISCONNECT");
    await transport.disconnect();

    cb({ message: "All done!" });
};



const onlineCompiler = "compile.protofy.xyz";
export const downloadDeviceFirmwareEndpoint = (targetDevice, compileSessionId) => {
    return (`https://${onlineCompiler}/api/v1/device/download/${targetDevice}?compileSessionId=${compileSessionId}`)
};

export const onlineCompilerSecureWebSocketUrl = () => {
    return (`wss://${onlineCompiler}/websocket`)
};

export const postYamlApiEndpoint = (targetDevice) => {
    return (`https://${onlineCompiler}/api/v1/device/edit/${targetDevice}`);
};

export const compileActionUrl = (targetDevice, compileSessionId) => {
    return (`https://${onlineCompiler}/api/v1/device/compile/${targetDevice}?compileSessionId=${compileSessionId}`)
};

export const compileMessagesTopic = (targetDevice) => {
    return (`device/compile/${targetDevice}`);
}