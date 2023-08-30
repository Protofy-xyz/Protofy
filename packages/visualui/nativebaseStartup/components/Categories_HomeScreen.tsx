import React, { forwardRef } from 'react';
import {
    Box,
    Text,
    VStack,
    Center,
    IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from "baseapp/palettes/uikit/Icon";
import HStack from 'baseapp/palettes/uikit/Row';

type Icon = {
    name: string;
    text: string;
};
type IconType = { icons: Icon[] };

export default forwardRef(({ icons }: IconType, ref) => {
    return (
        <VStack ref={ref} px="2" >
            <Text
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                fontSize="md"
                fontWeight="bold"
            >
                Categories
            </Text>

            <HStack space="2" alignItems="center">
                <Box>
                    <Center
                        _light={{ bg: 'primary.100' }}
                        _dark={{ bg: 'coolGray.700' }}
                        rounded="full"
                        w={{ base: 10, md: 12 }}
                        h={{ base: 10, md: 12 }}
                    >
                        <Icon
                            as={MaterialIcons}
                            name={'plus'}
                            _light={{ color: 'primary.900' }}
                            _dark={{ color: 'coolGray.50' }}
                            size={16}
                        ></Icon>
                    </Center>
                    <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        _light={{ color: { base: 'coolGray.800', md: 'coolGray.500' } }}
                        _dark={{ color: { base: 'coolGray.50', md: 'coolGray.400' } }}
                        textAlign="center"
                    >
                        Maths
                    </Text>
                </Box>
                <Box>
                    <Center
                        _light={{ bg: 'primary.100' }}
                        _dark={{ bg: 'coolGray.700' }}
                        rounded="full"
                        w={{ base: 10, md: 12 }}
                        h={{ base: 10, md: 12 }}
                    >
                        <Icon
                            as={MaterialIcons}
                            name={'lightbulb'}
                            _light={{ color: 'primary.900' }}
                            _dark={{ color: 'coolGray.50' }}
                            size={16}
                        ></Icon>
                    </Center>
                    <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        _light={{ color: { base: 'coolGray.800', md: 'coolGray.500' } }}
                        _dark={{ color: { base: 'coolGray.50', md: 'coolGray.400' } }}
                        textAlign="center"
                    >
                        Physics
                    </Text>
                </Box>
            </HStack>
        </VStack>
    );
})
