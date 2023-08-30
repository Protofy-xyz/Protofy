import React, {useEffect} from "react";
import { Modal, Box, Text, Button, Image } from "native-base";

const DeviceModal = ({ stage, onCancel, onSelect, showModal, modalFeedback }) => {
    const isError = modalFeedback?.details?.error
    const isLoading = ['write'].includes(stage) && !isError && !modalFeedback?.message?.includes('Please hold "Boot"')
    const visibleImage = (isLoading || ['idle', 'compile'].includes(stage)) && !isError

    const stages = {
        'yaml': 'Uploading yaml to the project...', 
        'compile': 'Compiling firmware...', 
        'upload': 'Connect your device and click select to chose the port. ', 
        'write': 'Writting firmware to device. Please do not unplug your device.', 
        'idle': 'Device configured successfully. You can unplug your device.'
    }

    const [msg, setMsg] = React.useState(stages[stage])

    const ModalText = () => {
        return ( 
            <Text textAlign='center' color={isError ? 'warning.600' : ''} 
                mb={'0px'} mt={isError ? '80px' : ''}>
                {
                    stage === 'upload' 
                    && !isError
                    && <>If you don't see your device on the menu, download device drivers on
                        <a href="https://www.silabs.com/documents/public/software/CP210x_Windows_Drivers.zip" target="_blank" style={{ paddingLeft: '5px'}}>
                        Windows
                        </a>, 
                        <a href="https://www.silabs.com/documents/public/software/Mac_OSX_VCP_Driver.zip" target="_blank" style={{ paddingInline: '5px'}}>
                        Mac
                        </a> 
                        or <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads" target="_blank">
                        other OS
                        </a>
                    </> 
                }
            </Text>
        )
    }

    const stepsTranslator = {
        'compile': '1',
        'upload': '2',
        'write': '3',
        'idle': '4'
    }

    return (<Modal isOpen={showModal} onClose={() => onCancel()} backgroundColor="yellow" style={{ position: 'relative'}}>
        <Modal.Content h="350" style={{ position: 'relative', overflow: 'visible'}}>
            <Box justifyContent='space-between' flex="1" px="50px" py="20px" style={{ borderRadius: '20px'}}>
                <Box>
                    <Text textAlign='center' fontWeight="bold" fontSize='xs'>{`[${stepsTranslator[stage]}/${Object.keys(stepsTranslator).length}]`}</Text>
                    <Text textAlign='center' color={isError ? 'warning.600' : ''} 
                        mb={'0px'} mt={stepsTranslator[stage] === '2' ? '80px': '0px'}>
                        {
                            modalFeedback && ['write', 'compile', 'upload'].includes(stage) 
                                ?  modalFeedback.message : msg
                        }
                    </Text>
                    <ModalText/>
                    {isLoading
                        ? <Image
                            alt="protofito loading"
                            h={'160px'}
                            w={'300px'}
                            alignSelf='center'
                            mt='60px'
                            mb='10px'
                            source={require('../../assets/protofitos/protofito-loading.gif')}
                        />
                        : null}
                    {stage == 'idle' && !isError
                        ? <Image
                            alt="protofito dancing"
                            h={'160px'}
                            w={'190px'}
                            alignSelf='center'
                            mt='60px'
                            mb='10px'
                            source={require('../../assets/protofitos/protofito-dancing.gif')}
                        />
                        : null}
                    {stage == 'compile' && !isError
                        ? <Image
                            alt="protofito compiling"
                            h={'160px'}
                            w={'180px'}
                            alignSelf='center'
                            mt='60px'
                            mb='10px'
                            source={require('../../assets/protofitos/protofito-compiling.gif')}
                        />
                        : null}
                </Box>
                <Button.Group space={2} justifyContent={'center'}>
                    {stage != 'write' && stage != 'idle' || isError ? <Button variant="ghost" colorScheme="warmGray" onPress={() => {
                        onCancel()
                    }}>
                        Cancel
                    </Button> : <></>}
                    {stage == 'upload' ? <Button onPress={() => {
                        onSelect()
                    }}>
                        Select
                    </Button> : <></>}
                    {stage == 'idle' ? <Button onPress={() => {
                        onCancel()
                    }}>
                        Done!
                    </Button> : <></>}
                </Button.Group>
            </Box>
        </Modal.Content>
    </Modal >)
}

export default DeviceModal