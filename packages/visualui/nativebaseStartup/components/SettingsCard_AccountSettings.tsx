import React, { forwardRef } from 'react';
import {
    HStack,
    Text,
    Pressable,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'baseapp/palettes/uikit/Icon';

export default forwardRef((props, ref) => {
    return (
        <Pressable
            ref={ref}
            _light={{ _pressed: { bg: 'coolGray.200' } }}
            _dark={{ _pressed: { bg: 'coolGray.700' } }}
            px="4"
            py="3"
        >
            <HStack justifyContent="space-between">
                <HStack space="4" alignItems="center">
                    <Icon
                        name={props.iconName}
                        size={15}
                        _light={{ color: 'coolGray.500' }}
                        _dark={{ color: 'coolGray.400' }}
                    />
                    <Text
                        fontSize="md"
                        _dark={{ color: 'coolGray.50' }}
                        _light={{ color: 'coolGray.800' }}
                        lineHeight="24"
                    >
                        {props.name}
                    </Text>
                </HStack>
                <Text
                    fontSize="md"
                    _dark={{ color: 'coolGray.400' }}
                    _light={{ color: 'coolGray.500' }}
                >
                    {props.option}
                </Text>
            </HStack>
        </Pressable>
    )
})