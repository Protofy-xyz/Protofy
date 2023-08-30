import React, { useState } from "react";
import { Modal, Image, Input, Button } from "native-base";
import TypicalConsultant from "../TypicalConsultant";
import { useOpenAIStore } from "../../../store/OpenAIStore";

type Props = {
  modalVisible: boolean;
  onClose: Function;
  onSubmit: Function;
};

export const ConfigAIModal = ({ modalVisible, onClose, onSubmit }: Props) => {

  const generateExampleText = useOpenAIStore(state => state.generateExampleText)

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const margin = '60px'
  const _onSubmit = async () => {
    setLoading(true)
    await generateExampleText(text)
    setLoading(false)
    onSubmit()
  }
  return (
    <Modal isOpen={modalVisible} onClose={() => onClose()} bgColor={'#00000050'}>
      <Modal.Content width={'80vw'} maxW={'600px'} borderRadius={'60px'} paddingX={'60px'} paddingTop={'60px'} paddingBottom={'40px'}>
        {/* <Modal.CloseButton /> */}
        <Image alt="protofito" alignSelf={'center'} resizeMode="contain" source={require("../../../assets/protofitos/protofito-quack.png")} size="md" marginBottom={margin} />
        <TypicalConsultant wrapper="none" steps={[`Hi I'm Protofito and I'm going to help you with your project. Describe the idea of your project and forget about the fucking "lorem ipsum".`]} />
        <Input variant={'underlined'} placeholder="Description of your project here..." w="100%" marginY={margin} value={text} onChangeText={text => setText(text)} />
        <Button isLoading={loading} variant={'ghost'} _text={{ fontWeight: '700' }} marginTop={'50px'} onPress={() => _onSubmit()}>Save</Button>
      </Modal.Content>
    </Modal>
  );
};
