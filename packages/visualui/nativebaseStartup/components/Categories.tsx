import React from 'react';
import {
  Box,
  Icon,
  Text,
  VStack,
  FlatList,
  Center,
  IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
type Icon = {
  name: string;
  text: string;
};
type IconType = { icons: Icon[] };

const Categories = ({ icons }: IconType) => {
  return (
    <VStack px={{ base: 4, md: 8 }}>
      <Text
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
        fontSize="md"
        fontWeight="bold"
      >
        Categories
      </Text>
      <FlatList
        mt={4}
        data={icons}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Box w="8" />}
        renderItem={({ item }) => (
          <VStack space="2" alignItems="center">
            <Center
              _light={{ bg: 'primary.100' }}
              _dark={{ bg: 'coolGray.700' }}
              rounded="full"
              w={{ base: 10, md: 12 }}
              h={{ base: 10, md: 12 }}
            >
              <IconButton
                variant="unstyled"
                icon={
                  <Icon
                    as={MaterialIcons}
                    name={item.name}
                    _light={{ color: 'primary.900' }}
                    _dark={{ color: 'coolGray.50' }}
                    size={6}
                  />
                }
              />
            </Center>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              _light={{ color: { base: 'coolGray.800', md: 'coolGray.500' } }}
              _dark={{ color: { base: 'coolGray.50', md: 'coolGray.400' } }}
              textAlign="center"
            >
              {item.text}
            </Text>
          </VStack>
        )}
      />
    </VStack>
  );
};

export default Categories;
