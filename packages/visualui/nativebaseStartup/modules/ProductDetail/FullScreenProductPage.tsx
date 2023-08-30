import React, { useState } from 'react';
import { Box, HStack, Icon, Image, StatusBar, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const images = [require('./images/productbaby.png')];

export default function FullScreenProductPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{ bg: 'coolGray.900' }}
        _dark={{ bg: 'coolGray.800' }}
      />
      <Box
        flex="1"
        alignItems="center"
        bg={{ base: 'coolGray.800', md: 'coolGray.900' }}
      >
        <Box maxW="1016" w="100%">
          <HStack
            justifyContent={{ base: 'flex-start', md: 'flex-end' }}
            px={{ base: '3', md: '0' }}
            py="4"
            bg="coolGray.900"
            mt={{ base: '0', md: '10' }}
          >
            <Pressable p={1}>
              <Icon
                size="7"
                as={MaterialIcons}
                name="close"
                color="coolGray.50"
              />
            </Pressable>
          </HStack>
          <Box height="620" flex={1} width="100%" mt={{ base: 5, md: 0 }}>
            <Image
              key={currentImageIndex}
              resizeMode="cover"
              source={images[currentImageIndex]}
              alt="Product full screen display"
              height="620"
              width="full"
            />
            <HStack alignItems="center" justifyContent="space-between">
              <Pressable
                position="absolute"
                ml={6}
                bottom="260px"
                onPress={() =>
                  setCurrentImageIndex((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1
                  )
                }
              >
                <Icon
                  size={{ base: 6, md: 10 }}
                  as={MaterialIcons}
                  name="arrow-back-ios"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.800' }}
                />
              </Pressable>
              <Pressable
                position="absolute"
                bottom="260px"
                right="6"
                onPress={() =>
                  setCurrentImageIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
                  )
                }
              >
                <Icon
                  size={{ base: 6, md: 10 }}
                  as={MaterialIcons}
                  name="arrow-forward-ios"
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.900' }}
                />
              </Pressable>
            </HStack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
