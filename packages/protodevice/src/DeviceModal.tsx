import React, { useEffect, useState } from "react";
import { AlertDialog } from 'protolib/components/AlertDialog'
import { Tinted } from 'protolib/components/Tinted'
import { useThemeName } from 'tamagui'
import { Maximize, Minimize, Upload, X, SearchCode, Rese, RefreshCcw, Download } from '@tamagui/lucide-icons'
import { Button, YStack, Text, XStack } from "@my/ui"
import { EspWebInstall } from "./EspWebInstall"
import { EspConsole } from "./espConsole";
import { resetDevice, downloadLogs } from "protolib/bundles/devices/devicesUtils";

const DeviceModal = ({ consoleOutput, stage, onCancel, onSelect, showModal, modalFeedback, selectedDevice, compileSessionId, onSelectAction }) => {
    const [fullscreen, setFullscreen] = useState(false);
    const [manifestUrl, setManifestUrl] = useState(null)
    const isError = modalFeedback?.details?.error
    const isLoading = ['write'].includes(stage) && !isError && !modalFeedback?.message?.includes('Please hold "Boot"')
    const themeName = useThemeName();
    const stages = {
        'yaml': 'Uploading yaml to the project...',
        'compile': 'Compiling firmware...',
        'select-action': 'What do you want to do?',
        'upload': 'Connect your device and click select to chose the port. ',
        'write': 'Writting firmware to device. Please do not unplug your device.',
        'idle': 'Device configured successfully.\n You can unplug your device.'
    }

    const Link = (props, style) => {
        return <Tinted><a
            target="_blank"
            onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none'
            }}
            {...props}
        /></Tinted>
    }

    const DriversNote = () => {

        const drivers = [
            { os: 'Windows', link: 'https://www.silabs.com/documents/public/software/CP210x_Windows_Drivers.zip' },
            { os: 'Mac', link: 'https://www.silabs.com/documents/public/software/Mac_OSX_VCP_Driver.zip' },
            { os: 'other OS', link: 'https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads' }
        ]

        return stage === 'upload'
            && !isError
            && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Text fontWeight="600">{"Note: "}</Text>
                    <Text >{"If you don't see your device on the menu, download the device drivers on "}</Text>
                    {drivers.map((driver, index) => (
                        <Link style={{ color: "var(--color8)" }} key={index} href={driver.link}>
                            {`${driver.os}${index < drivers.length - 1 ? ", " : ""}`}
                        </Link>
                    ))}
                    {"."}
                </div>
            )
    }

    const images = {
        "light": {
            "compile": '/images/device/protofitoCompiling.gif',
            "loading": '/images/device/protofitoLoading.gif',
            "idle": '/images/device/protofitoDancing.gif'
        },
        "dark": {
            "compile": '/images/device/protofitoCompilingW.gif',
            "loading": '/images/device/protofitoLoadingW.gif',
            "idle": '/images/device/protofitoDancingW.gif'
        }
    }

    useEffect(() => {
        const fetchManifestUrl = async () => {
            if (stage === 'upload') {
                try {
                    const url = await selectedDevice?.getManifestUrl(compileSessionId);
                    setManifestUrl(url);
                } catch (error) {
                    console.error("Error fetching manifest URL:", error);
                }
            }
            if (stage == 'console') {
                setFullscreen(true)
            }
        };

        fetchManifestUrl();
    }, [stage, selectedDevice, compileSessionId]);

    console.log('dev: stage', stage)

    return <AlertDialog open={showModal} hideAccept={true}>
        <YStack
            height={fullscreen ? "80vh" : "450px"}
            width={fullscreen ? "80vw" : "500px"}
            padding={"$3"}
            gap={"$6"}
            justifyContent="space-between"
        >
            {!["console"].includes(stage) &&
                <XStack justifyContent="center" alignItems="center" >
                    <Text fontWeight="600" fontSize="xs" textAlign='center'>
                        {`[${Object.keys(stages).indexOf(stage)}/${Object.keys(stages).length}]`}
                    </Text>
                    {/* Fullscreen toggle */}
                    <Button
                        position="absolute"
                        left={0}
                        size="$2"
                        icon={fullscreen ? <Minimize size="$1" /> : <Maximize size="$1" />}
                        onPress={() => setFullscreen(prev => !prev)}
                        backgroundColor="transparent"
                        pressStyle={{ scale: 1.1 }}
                        hoverStyle={{ opacity: 0.7 }}
                        padding="$2"
                        paddingVertical="$4"
                    />
                    <Button
                        position="absolute"
                        right={0}
                        size={"$3"}
                        theme="red"
                        circular
                        icon={X}
                        onPress={() => onCancel()}
                    />
                </XStack>
            }
            {stage === 'console'
                ? <EspConsole consoleOutput={consoleOutput} />
                : <>
                    <YStack justifyContent="center" flex={1} gap={"$2"}>
                        <Text fontWeight={"600"} textAlign="center" color={isError ? 'red' : ''}>
                            {modalFeedback && ['write', 'compile', 'upload', 'yaml'].includes(stage)
                                ? modalFeedback.message
                                : stages[stage]
                            }
                        </Text>
                        {
                            !isError && images[themeName][isLoading ? 'loading' : stage] && (
                                <img
                                    alt="protofito dancing"
                                    style={{
                                        height: isLoading ? "200px" : "180px",
                                        width: isLoading ? "300px" : "190px",
                                        alignSelf: "center",
                                        objectFit: 'cover',
                                        paddingTop: "20px"
                                    }}
                                    src={images[themeName][isLoading ? 'loading' : stage]}
                                />
                            )}
                    </YStack>
                    <DriversNote />
                </>
            }
            {
                (stage == 'select-action' && !isError) &&
                <XStack gap="$3" flex={1} justifyContent="center">
                    <Tinted>
                        <Button icon={Upload} onPress={() => onSelectAction("write")}>{`Install ${selectedDevice.getId()} firmware`}</Button>
                        <Button icon={SearchCode} onPress={() => onSelectAction("console")}>Watch logs</Button>
                    </Tinted>
                    {/* <Button disabled color={"gray"}>Wi-Fi (soon)</Button> */}
                </XStack>
            }

            <XStack justifyContent="center" gap={"$4"}>
                {stage == "console" &&
                    <XStack justifyContent="center" gap={"$4"}>
                        <Tinted>
                            <Button icon={RefreshCcw} onPress={() => resetDevice()}>Reset device</Button>
                            <Button icon={Download} onPress={() => downloadLogs(consoleOutput)}>Download logs</Button>
                        </Tinted>
                    </XStack>
                }
                {
                    (!["write", "idle", "upload", "compile"].includes(stage) || isError) &&
                    <Button onPress={() => {
                        onCancel()
                        setFullscreen(false)
                    }}>Cancel</Button>
                }
                {
                    stage == 'upload' &&
                    <Button backgroundColor={"black"} color={"white"} onPress={() => onSelect()}>Select</Button>
                }
                {/* {
                        (stage == 'upload' && manifestUrl) &&
                        <EspWebInstall.ModalButton onPress={() => onCancel()} manifestUrl={manifestUrl} />
                    } */}
                {
                    stage == 'idle' &&
                    <Button backgroundColor="black" color={"white"} onPress={() => onCancel()}>Done !</Button>
                }
            </XStack>
        </YStack>
    </AlertDialog >
}

export default DeviceModal