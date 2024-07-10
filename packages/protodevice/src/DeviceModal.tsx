import React from "react";
import { AlertDialog } from 'protolib'
import { Tinted } from 'protolib'
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

    // return (<Modal isOpen={showModal} onClose={() => onCancel()} style={{ position: 'relative',backgroundColor: "yellow"}}>
    return (<AlertDialog open={showModal} hideAccept={true}>
        <div style={{ height: "350px", width: '400px', position: 'relative', overflow: 'visible', justifyContent: "space-between", display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'xs' }}>{`[${stepsTranslator[stage]}/${Object.keys(stepsTranslator).length}]`}</div>
                <div style={{ flexGrow: 1, textAlign: 'center', color: isError ? 'red' : '', marginBottom: "0px", marginTop: stepsTranslator[stage] === '3' || stepsTranslator[stage] === '1'? '100px' : '0px' }}>
                    {
                        modalFeedback && ['write', 'compile', 'upload','yaml'].includes(stage)
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