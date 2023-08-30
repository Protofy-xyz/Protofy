import React, { forwardRef } from 'react';
import {
    HStack,
    Text,
    Box,
    Progress,
    Button
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'baseapp/palettes/uikit/Icon';

export default forwardRef((props, ref) => {
    return (
        <HStack
            px="4"
            py="3"
            mx={{ base: '4', md: '0' }}
            mt={{ base: '5', md: '8' }}
            space="6"
            _light={{ bg: 'white' }}
            _dark={{
                bg: 'coolGray.800',
            }}
            rounded="sm"
            alignItems="center"
            justifyContent="space-between"
        >
            <Box flex={1}>
                <HStack space="3">
                    <Icon
                        name="cloud-outline"
                        size="6"
                        _light={{ color: 'coolGray.500' }}
                        _dark={{ color: 'coolGray.400' }}
                    />
                    <Text
                        fontSize="md"
                        fontWeight="medium"
                        _dark={{ color: 'coolGray.50' }}
                        _light={{ color: 'coolGray.800' }}
                        lineHeight="24"
                    >
                        Storage
                    </Text>
                </HStack>
                <Progress
                    mt="3"
                    size="sm"
                    value={40}
                    width="full"
                    rounded="xs"
                    _light={{
                        bg: 'coolGray.100',
                        _filledTrack: { bg: 'primary.900' },
                    }}
                    _dark={{
                        bg: 'coolGray.700',
                        _filledTrack: { bg: 'primary.500' },
                    }}
                />
                <Text
                    fontSize="xs"
                    mt="2"
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                >
                    4 GB of 15 GB used
                </Text>
            </Box>
            <Button
                variant="outline"
                width={{ base: '105', md: '144' }}
                size="sm"
                _text={{
                    fontSize: 'xs',
                }}
                py={3}
            >
                Buy Storage
            </Button>
        </HStack>
    )
})