import React, { useEffect, useState } from "react";
import { AlertDialog } from 'protolib/components/AlertDialog'
import { Tinted } from 'protolib/components/Tinted'
import { useThemeName } from 'tamagui'
import { Maximize, Minimize } from '@tamagui/lucide-icons'
import { Button } from "@my/ui"

const DeviceModal = ({ stage, onCancel, onSelect, showModal, modalFeedback, selectedDevice, compileSessionId }) => {

    const [fullscreen, setFullscreen] = useState(false);
    const isError = modalFeedback?.details?.error
    const isLoading = ['write'].includes(stage) && !isError && !modalFeedback?.message?.includes('Please hold "Boot"')
    const themeName = useThemeName();
    const stages = {
        'yaml': 'Uploading yaml to the project...',
        'compile': 'Compiling firmware...',
        'upload': 'Connect your device and click select to chose the port. ',
        'write': 'Writting firmware to device. Please do not unplug your device.',
        'idle': 'Device configured successfully. You can unplug your device.'
    }

    const [msg, setMsg] = React.useState(stages[stage])
    const [manifestUrl, setManifestUrl] = useState(null)

    const Link = (props) => {
        return <Tinted><a
        target="_blank"
        style={{ color:"var(--color8)" }}
        onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline'
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none'
        }}
        {...props}
    /></Tinted>
    }
    const ModalText = () => {
        return stage === 'upload'
            && !isError
            && (
                <div style={{ textAlign: 'center', color: isError ? 'red' : '', marginTop: '20px', marginBottom: '0px' }}>
                    <>
                        {"Note: If you don't see your device on the menu, download device drivers on "}
                        <Link href="https://www.silabs.com/documents/public/software/CP210x_Windows_Drivers.zip" >
                            Windows
                        </Link>
                        <a>
                            {', '}
                        </a>
                        <Link href="https://www.silabs.com/documents/public/software/Mac_OSX_VCP_Driver.zip">
                            Mac
                        </Link>
                        <a>
                            {' or '}
                        </a>
                        <Link href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads">
                            other OS
                        </Link>
                    </>
                </div>
            )
    }

    const stepsTranslator = {
        'yaml': '1',
        'compile': '2',
        'upload': '3',
        'write': '4',
        'idle': '5'
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
                const script = document.createElement('script');
                script.src = "https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module";
                script.type = "module";
                script.async = true;
                document.body.appendChild(script);
        
                try {
                    const url = await selectedDevice?.getManifestUrl(compileSessionId);
                    setManifestUrl(url);
                } catch (error) {
                    console.error("Error fetching manifest URL:", error);
                }
            }
        };
    
        fetchManifestUrl();
    }, [stage, selectedDevice, compileSessionId]);

    // return (<Modal isOpen={showModal} onClose={() => onCancel()} style={{ position: 'relative',backgroundColor: "yellow"}}>
    return (<AlertDialog open={showModal} hideAccept={true}>
        <div style={{ 
            position: 'relative',
            height: fullscreen ? "80vh" : "350px",
            width: fullscreen ? "80vw" : '400px',
            transition: 'all 0.3s ease',
            overflow: 'visible',
            justifyContent: "space-between",
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxSizing: 'border-box',
            flexGrow: 1
        }}>
            {/* Fullscreen toggle */}
            <Button
                position="absolute"
                top="$2"
                right="$2"
                size="$2"
                icon={fullscreen ? <Minimize size="$1" /> : <Maximize size="$1" />}
                onPress={() => setFullscreen(prev => !prev)}
                backgroundColor="transparent"
                pressStyle={{ scale: 1.1 }}
                hoverStyle={{ opacity: 0.7 }}
                padding={24}
            />
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'xs' }}>{`[${stepsTranslator[stage]}/${Object.keys(stepsTranslator).length}]`}</div>
            <div
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    marginTop: stepsTranslator[stage] === '3' || stepsTranslator[stage] === '1' ? '100px' : '0px',
                    marginBottom: 0,
                }}
                >
                {modalFeedback && ['write', 'compile', 'upload', 'yaml'].includes(stage)
                    ? modalFeedback.message
                    : <div style={{ textAlign: 'center', color: isError ? 'red' : '' }}>{msg}</div>}
                    <ModalText />

            </div>

            {
                !isError && images[themeName][isLoading ? 'loading' : stage] ?
                    <img
                        alt="protofito dancing"
                        style={{ height: isLoading ? "200px" : "180px", width: isLoading ? "300px" : "190px", alignSelf: "center", objectFit: 'cover', paddingTop: "20px" }}
                        src={images[themeName][isLoading ? 'loading' : stage]}
                    /> : null
            }

            <div style={{ justifyContent: 'center', alignSelf: 'center', display: 'flex', gap: "20px" }}>
                {stage != 'write' && stage != 'idle' || isError ? <button
                    style={{ padding: '10px 20px 10px 20px', backgroundColor: '#cccccc40', borderRadius: '10px' }}
                    onClick={() => {
                        onCancel()
                    }}>
                    Cancel
                </button> : <></>}
                {(stage == 'upload' && manifestUrl) ?
                <button
                    style={{ padding: '10px 20px 10px 20px', backgroundColor: 'black', color: 'white', borderRadius: '10px' }}
                    onClick={() => {
                        onCancel()
                        console.log("Manifest URL being passed:", manifestUrl);
                    }}>
                    <esp-web-install-button manifest={manifestUrl}>
                        <button slot="activate">Select</button>
                        <span slot="unsupported">Ah snap, your browser is not supported!</span>
                        <span slot="not-allowed">Ah snap, you are not allowed to use this on HTTP!</span>
                    </esp-web-install-button>
                </button> : <></>}
                {stage == 'idle' ? <button
                    style={{ padding: '10px 20px 10px 20px', backgroundColor: 'black', color: 'white', borderRadius: '10px' }}
                    onClick={() => {
                        onCancel()
                    }}>
                    Done!
                </button> : <></>}
            </div>
        </div>
    </AlertDialog >)
}

export default DeviceModal