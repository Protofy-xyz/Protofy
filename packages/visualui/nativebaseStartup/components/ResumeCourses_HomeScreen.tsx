import React, { forwardRef } from 'react';
import {
    Box,
    HStack,
    Icon,
    Text,
    VStack,
    FlatList,
    Avatar,
    Image,
    Pressable,
    IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType, Platform } from 'react-native';

export type Course = {
    id: number;
    name?: string;
    chapter?: string;
    imageUri: ImageSourcePropType;
};

export default forwardRef(({ courses }: { courses: Course[] }, ref) => {
    return (
        <VStack ref={ref} px={{ base: 4, md: 8 }} space={4}>
            <Text
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
                fontSize="md"
                fontWeight="bold"
            >
                Resume your course
            </Text>
            {/* <FlatList
                data={courses}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }: { item: Course }) => {
                    return ( */}
            <Pressable>
                <Box overflow="hidden" rounded="lg" width={{ base: '80', md: '334' }}>
                    <Image height="112" source={{ "uri": 'public/nativebaseStartup/emc.png' }} alt="Alternate Text" />
                    <HStack
                        _light={{ bg: 'coolGray.100' }}
                        _dark={{ bg: 'coolGray.700' }}
                        p="3"
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <VStack>
                            <Text
                                fontSize="xs"
                                _light={{ color: 'coolGray.900' }}
                                _dark={{ color: 'coolGray.100' }}
                                fontWeight="medium"
                            >
                                Chapter 1
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                _light={{ color: 'coolGray.900' }}
                                _dark={{ color: 'coolGray.100' }}
                            >
                                Theory of relativity
                            </Text>
                            <HStack space="2" alignItems="center">
                                <Text
                                    fontSize="xs"
                                    textAlign="center"
                                    _light={{ color: 'coolGray.800' }}
                                    _dark={{ color: 'coolGray.300' }}
                                >
                                    Active Users
                                </Text>
                                <Avatar.Group space={-2} _avatar={{ size: 'xs' }}>
                                    <Avatar
                                        _light={{ borderColor: 'coolGray.100' }}
                                        _dark={{ borderColor: 'coolGray.700' }}
                                        source={{ "uri": 'public/nativebaseStartup/women.jpg' }}
                                    ></Avatar>
                                    <Avatar
                                        _light={{ borderColor: 'coolGray.100' }}
                                        _dark={{ borderColor: 'coolGray.700' }}
                                        source={{ "uri": 'public/nativebaseStartup/nice-girl.jpg' }}
                                    ></Avatar>
                                    <Avatar
                                        _light={{ borderColor: 'coolGray.100' }}
                                        _dark={{ borderColor: 'coolGray.700' }}
                                        source={{ "uri": 'public/nativebaseStartup/smiling.jpg' }}
                                    ></Avatar>
                                </Avatar.Group>
                            </HStack>
                        </VStack>
                        <IconButton
                            _light={{
                                bg: 'primary.900',
                            }}
                            _dark={{
                                bg: 'primary.700',
                            }}
                            rounded="full"
                            variant="unstyled"
                            icon={
                                <Icon
                                    as={MaterialIcons}
                                    name="play-arrow"
                                    color="coolGray.50"
                                    size={5}
                                ></Icon>
                            }
                        ></IconButton>
                    </HStack>
                </Box>
            </Pressable>
            {/* );
                }}
                ItemSeparatorComponent={() => <Box w="4" />}
            ></FlatList> */}
        </VStack>
    );
})