import React, { memo } from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'native-base';
import { theme } from 'internalapp/theme';
import Typical from 'react-typical'
import ReactTypingEffect from 'react-typing-effect';

type Props = {
    steps: string[];
    wrapper: string;
    style?: ViewStyle;
    labelStyle?: TextStyle;
};

const TipicalConsultant = ({ steps, wrapper, style, labelStyle }: Props) => {

    return (
        <View style={{ flexDirection: "column", alignItems: 'flex-start', alignSelf: 'flex-start', width: '100%', ...style }}>
            <Text style={{ ...labelStyle }} fontWeight={'600'}>{"Protofito:"}</Text>
                <Text fontWeight="300" style={{ textAlignVertical: 'flex-start'}} >
                    {/* UNCOMENT TO DISABLE TIPICAL */}
                    {/* {steps[0]} */}
                    {/* UNCOMENT TO ENABLE TIPICAL */}
                    <ReactTypingEffect
                        text={steps[0]}
                        speed={50}
                        eraseDelay={200000}
                    />
                    {/* <Typical
                        steps={steps}
                        loop={1}
                        wrapper={wrapper}
                    /> */}
                </Text>
            {/* </Text> */}
        </View >
    )
}
    ;

export default memo(TipicalConsultant);