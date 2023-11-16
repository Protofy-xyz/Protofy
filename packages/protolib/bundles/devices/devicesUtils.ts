import { Transport, ESPLoader } from "protodevice/src/device/esptool-js";
import { sleep } from "protodevice/src/sleep";
import { Build, FlashError } from "protodevice/src/const";
import { manifest } from "protodevice/src/manifest";

const onlineCompilerUrl = "https://firmware.protofy.xyz/api/v1";
let port;

const resetTransport = async (transport: Transport) => {
    await transport.device.setSignals({
        dataTerminalReady: false,
        requestToSend: true,
    });
    await transport.device.setSignals({
        dataTerminalReady: false,
        requestToSend: false,
    });
};

export const connectSerialPort = async () => {
    let isError = true
    try {
        port = await navigator.serial.requestPort();
    } catch (err: any) {
        if ((err as DOMException).name === "NotFoundError") {
            //setConfigError(state => ('Please select a port.'))
            return isError;
        }
        //setConfigError(state => ('Error configuring port.'))
        return isError;
    }

    if (!port) {
        //setConfigError(state => ('Error trying to request port. Please check your browser drivers.'))
        return isError;
    }
    try {
        await port.open({ baudRate: 115200 });
        //setConfigError('') 
    } catch (err: any) {
        //setConfigError(state => ('Error can not open serial port.'))
        return isError;
    }
}

export const flash = async (cb) => {
    cb({ message: 'Please hold "Boot" button of your ESP32 board.' })
    let build: Build | undefined;
    let chipFamily: Build["chipFamily"];
    const transport = new Transport(port);
    const esploader = new ESPLoader(
        transport,
        115200,
        // Wrong type, fixed in https://github.com/espressif/esptool-js/pull/75/files
        undefined as any
    );

    //ESptools like to reopen the port
    await port.close();
    // For debugging
    (window as any).esploader = esploader;
    try {
        await esploader.main_fn();
        //await esploader.flash_id(); //not used -> seems taht not affects to correct function
    } catch (err: any) {
        console.error(err);
        cb({ message: "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.", details: { error: FlashError.FAILED_INITIALIZING, details: err } });
        await resetTransport(transport);
        await transport.disconnect();
        throw "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL."
    }
    chipFamily = esploader.chip.CHIP_NAME as any;
    console.log("chipFamily: ", chipFamily);
    if (!esploader.chip.ROM_TEXT) {
        cb({ message: `Chip ${chipFamily} is not supported`, details: { error: FlashError.NOT_SUPPORTED, details: `Chip ${chipFamily} is not supported` } })
        await resetTransport(transport);
        await transport.disconnect();
        throw `Chip ${chipFamily} is not supported`
    }
    cb({ message: `Initialized. Found ${chipFamily}`, details: { done: true } })

    build = manifest.builds.find((b) => b.chipFamily === chipFamily);

    if (!build) {
        cb({ message: `Your ${chipFamily} board is not supported.`, details: { error: FlashError.NOT_SUPPORTED, details: chipFamily } })
        await resetTransport(transport);
        await transport.disconnect();
        throw `Your ${chipFamily} board is not supported.`
    }

    cb({ message: "Preparing installation...", details: { done: false } })

    const filePromises = build.parts.map(async (part) => {

        // const url = "http://bo-firmware.protofy.xyz/api/v1" + "/electronics/download.bin?configuration=" + "test.yaml" + "&type=firmware-factory.bin"
        const url = onlineCompilerUrl + "/device/download?configuration=" + "test.yaml" + "&type=firmware-factory.bin"

        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(
                `Downlading firmware ${url} failed: ${resp.status}`
            );
        }

        const reader = new FileReader();
        const blob = await resp.blob();

        return new Promise<string>((resolve) => {
            reader.addEventListener("load", () => resolve(reader.result as string));
            reader.readAsBinaryString(blob);
        });

    });
    const fileArray: Array<{ data: string; address: number }> = [];
    let totalSize = 0;

    for (let part = 0; part < filePromises.length; part++) {
        try {
            const data = await filePromises[part];
            fileArray.push({ data, address: build.parts[part].offset });
            totalSize += data.length;
        } catch (err: any) {
            cb({ message: err.message, details: { error: FlashError.FAILED_FIRMWARE_DOWNLOAD, details: err.message } })
            await resetTransport(transport);
            await transport.disconnect();
            return;
        }
    }
    cb({ message: "Installation prepared", details: { done: true } })

    if (true) {
        cb({ message: "Erasing device...", details: { done: false } })
        await esploader.erase_flash();
        cb({ message: "Device erased", details: { done: true } })
    }
    cb({ message: `Writing progress: 0%`, details: { bytesTotal: totalSize, bytesWritten: 0, percentage: 0 } })

    let totalWritten = 0;

    try {
        await esploader.write_flash(
            fileArray,
            "keep",
            "keep",
            "keep",
            false,
            true,
            // report progress
            (fileIndex: number, written: number, total: number) => {
                const uncompressedWritten =
                    (written / total) * fileArray[fileIndex].data.length;

                const newPct = Math.floor(
                    ((totalWritten + uncompressedWritten) / totalSize) * 100
                );
                if (written === total) {
                    totalWritten += uncompressedWritten;
                    return;
                }
                cb({ message: `Writing progress: ${newPct}%`, details: { bytesTotal: totalSize, bytesWritten: totalWritten + written, percentage: newPct } })
            }
        );
    } catch (err: any) {
        cb({ message: err.message, details: { error: FlashError.WRITE_FAILED, details: err } })
        await resetTransport(transport);
        await transport.disconnect();
        return;
    }
    cb({ message: "Writing complete", details: { bytesTotal: totalSize, bytesWritten: totalWritten, percentage: 100 } })

    await sleep(100);
    console.log("HARD RESET");
    await resetTransport(transport);
    console.log("DISCONNECT");
    await transport.disconnect();
    cb({ message: "All done!" })
}