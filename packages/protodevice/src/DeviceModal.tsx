import React from "react";
// import { Modal } from "native-base";
import compiling from './assets/protofitoCompiling.gif';
import compilingW from './assets/protofitoCompilingW.gif';
import loading from './assets/protofitoLoading.gif';
import loadingW from './assets/protofitoLoadingW.gif';
import dancing from './assets/protofitoDancing.gif';
import dancingW from './assets/protofitoDancingW.gif';
import { AlertDialog, Tinted } from 'protolib'
import { useThemeName } from 'tamagui'



const DeviceModal = ({ stage, onCancel, onSelect, showModal, modalFeedback }) => {

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
        'compile': '1',
        'upload': '2',
        'write': '3',
        'idle': '4'
    }

    const images = {
        "light": {
            "compile": compiling.src,
            "loading": loading.src,
            "idle": dancing.src
        },
        "dark": {
            "compile": compilingW.src,
            "loading": loadingW.src,
            "idle": dancingW.src
        }
    }

    // return (<Modal isOpen={showModal} onClose={() => onCancel()} style={{ position: 'relative',backgroundColor: "yellow"}}>
    return (<AlertDialog open={showModal} hideAccept={true}>
        <div style={{ height: "350px", width: '400px', position: 'relative', overflow: 'visible', justifyContent: "space-between", display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'xs' }}>{`[${stepsTranslator[stage]}/${Object.keys(stepsTranslator).length}]`}</div>
                <div style={{ flexGrow: 1, textAlign: 'center', color: isError ? 'red' : '', marginBottom: "0px", marginTop: stepsTranslator[stage] === '2' ? '100px' : '0px' }}>
                    {
                        modalFeedback && ['write', 'compile', 'upload'].includes(stage)
                            ? modalFeedback.message : msg
                    }
                </div>
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
                {stage == 'upload' ? <button
                    style={{ padding: '10px 20px 10px 20px', backgroundColor: 'black', color: 'white', borderRadius: '10px' }}
                    onClick={() => {
                        onSelect()
                    }}>
                    Select
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