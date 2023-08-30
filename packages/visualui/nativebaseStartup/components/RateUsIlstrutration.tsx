import React, { forwardRef } from 'react';
import { HStack, Icon, Box, VStack, Pressable } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

type Icon = {
  name: string;
};


export default forwardRef((props, ref) => {
  return (
    <Box ref={ref}>
      <VStack
        borderWidth="1"
        rounded="md"
        py={{ base: 3, md: '18' }}
        px={5}
        _light={{ borderColor: 'coolGray.800' }}
        _dark={{ borderColor: 'coolGray.200' }}
        justifyContent="flex-start"
        width={{ base: '170', md: '270' }}
        mt={{ base: 5, md: 7 }}
        space="2"
      >
        {Array.from({ length: 2 }, () => (
          <Box
            _light={{ bg: 'coolGray.200' }}
            _dark={{ bg: 'coolGray.400' }}
            py={1}
            width={{ base: '130', md: '208' }}
            rounded="full"
          />
        ))}
        <Box
          _light={{ bg: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.400' }}
          py={1}
          width={{ base: '83', md: '127' }}
          rounded="full"
        />
      </VStack>
      <Rating filledStars={3} />

      <VStack
        borderWidth="1"
        rounded="md"
        py={{ base: 3, md: '18' }}
        px={5}
        _light={{ borderColor: 'coolGray.800' }}
        _dark={{ borderColor: 'coolGray.200' }}
        justifyContent="flex-start"
        width={{ base: '170', md: '270' }}
        mt={{ base: 5, md: 7 }}
        space="2"
      >
        {Array.from({ length: 2 }, () => (
          <Box
            _light={{ bg: 'coolGray.200' }}
            _dark={{ bg: 'coolGray.400' }}
            py={1}
            width={{ base: '130', md: '208' }}
            rounded="full"
          />
        ))}
        <Box
          _light={{ bg: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.400' }}
          py={1}
          width={{ base: '83', md: '127' }}
          rounded="full"
        />
      </VStack>
      <Rating filledStars={2} />
    </Box>
  );
})

function Rating({ filledStars }: { filledStars: number }) {
  return (
    <HStack
      width={{ base: '170', md: '270' }}
      mt={{ base: 2, md: 3 }}
      space="1"
      alignItems="center"
      justifyContent="flex-end"
    >
      {Array.from({ length: filledStars }, (item, index) => (
        <RateUsIcon key={index} name="star" filled />
      ))}
      {Array.from({ length: 5 - filledStars }, (item, index) => (
        <RateUsIcon key={index} name="star" />
      ))}
    </HStack>
  );
}

function RateUsIcon({ name, filled }: { name: string; filled?: boolean }) {
  return (
    <Pressable>
      <Icon
        size={{ base: 4, md: 6 }}
        as={AntDesign}
        name={name}
        _dark={{ color: filled ? 'yellow.200' : 'coolGray.400' }}
        _light={{ color: filled ? 'yellow.400' : 'coolGray.400' }}
      />
    </Pressable>
  );
}