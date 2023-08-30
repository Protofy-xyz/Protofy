import React, { useState } from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Input,
  Pressable,
  Center,
  Box,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type PlaceProps = {
  keyword: string;
  address: string;
};

const places: PlaceProps[] = [
  {
    keyword: 'Rashtreeya Vidyalaya Road',
    address: 'Agra, Uttar Pradesh',
  },
  {
    keyword: 'Rajajinagar',
    address: 'Bengaluru, Karnataka',
  },
  {
    keyword: 'Ran Hospital',
    address: 'Bengaluru, Karnataka',
  },
  {
    keyword: 'Register gister gis gis',
    address: 'Karnataka',
  },
  {
    keyword: 'Rasta Cafe',
    address: 'State Highway 17, Karnataka',
  },
  {
    keyword: 'Ramoji Film City',
    address: 'Ramoji Film City Main Road, Hyderabad',
  },
];

function RecentSearchItem({
  keyword,
  address,
  searchKeyword,
}: PlaceProps & { searchKeyword: string }) {
  const searchKeyWordLength = searchKeyword.length;
  let jsx = null;
  const strg = keyword;

  if (searchKeyWordLength === 0) {
    jsx = (
      <Text
        fontSize="md"
        _light={{ color: 'coolGray.500' }}
        _dark={{ color: 'coolGray.400' }}
        fontWeight="medium"
      >
        {keyword}
      </Text>
    );
  }

  if (searchKeyWordLength > 0) {
    const regex = new RegExp(searchKeyword, 'gi');
    let result;
    const indices = [];
    while ((result = regex.exec(strg))) {
      indices.push(result.index);
    }

    let currentIndex = 0;

    const JSX = indices.map((ind) => {
      let firstPart = '';
      let secondPart = '';
      if (currentIndex !== ind) {
        firstPart = keyword.substring(currentIndex, ind);
      }
      secondPart = keyword.substring(ind, ind + searchKeyWordLength);
      currentIndex = searchKeyWordLength + ind;

      return (
        <HStack key={ind}>
          <Text
            fontSize="md"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            fontWeight="medium"
          >
            {firstPart}
          </Text>
          <Text
            fontSize="md"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            fontWeight="medium"
          >
            {secondPart}
          </Text>
        </HStack>
      );
    });
    if (currentIndex <= keyword.length) {
      JSX.push(
        <Text
          key={currentIndex}
          fontSize="md"
          _light={{
            color:
              currentIndex !== indices[indices.length - 1]
                ? 'coolGray.500'
                : 'coolGray.800',
          }}
          _dark={{
            color:
              currentIndex !== indices[indices.length - 1]
                ? 'coolGray.400'
                : 'coolGray.50',
          }}
          fontWeight="medium"
        >
          {keyword.substring(currentIndex, keyword.length)}
        </Text>
      );
    }
    jsx = JSX;
  }

  return (
    <Pressable
      borderRadius={{ md: 'sm' }}
      _light={{
        _hover: { bg: 'primary.200' },
        _pressed: { bg: 'primary.300' },
      }}
      _dark={{
        _hover: { bg: 'coolGray.700' },
        _pressed: { bg: 'coolGray.600' },
      }}
      px="4"
      py="2.5"
    >
      <HStack alignItems="center" space="4">
        <VStack space={0.5}>
          <Center
            _light={{ bg: 'primary.50' }}
            _dark={{ bg: 'coolGray.700' }}
            size="8"
            rounded="full"
          >
            <Icon
              as={MaterialIcons}
              name="location-on"
              size="5"
              _light={{ color: 'primary.900' }}
              _dark={{ color: 'coolGray.400' }}
            />
          </Center>
          <Text
            fontSize="2xs"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.50' }}
            isTruncated
          >
            1.6 kms
          </Text>
        </VStack>

        <VStack space={1}>
          <HStack alignItems="center">{jsx}</HStack>
          <Text
            fontSize="xs"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.50' }}
            isTruncated
          >
            {address}
          </Text>
        </VStack>
        <Pressable ml="auto">
          <Icon
            as={<MaterialIcons name="north-west" />}
            size="5"
            color="coolGray.400"
          />
        </Pressable>
      </HStack>
    </Pressable>
  );
}
function MainContent() {
  const [textInput, setTextInput] = useState<string>('');
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      bounces={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Box
        flex="1"
        rounded={{ md: 'sm' }}
        px={{ md: '4' }}
        py={{ base: '5', md: '8' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <Input
          _stack={{
            px: '3',
          }}
          py="3"
          px="0"
          mb="2.5"
          mx="4"
          rounded="sm"
          value={textInput}
          onChangeText={setTextInput}
          _dark={{
            borderColor: 'coolGray.500',
            bg: 'coolGray.700',
          }}
          InputLeftElement={
            <Pressable mr="2">
              <Icon
                as={<MaterialIcons name="keyboard-backspace" />}
                size="6"
                color="coolGray.400"
              />
            </Pressable>
          }
          InputRightElement={
            <Pressable
              onPress={() => {
                setTextInput('');
              }}
              ml="2"
            >
              <Icon
                as={<MaterialIcons name="close" />}
                size="6"
                color="coolGray.400"
              />
            </Pressable>
          }
          placeholder="Hotel"
          placeholderTextColor="coolGray.400"
          fontSize="md"
          fontWeight="medium"
        />
        <Box>
          {places
            .filter(({ keyword }) =>
              keyword.toLowerCase().includes(textInput.toLowerCase())
            )
            .map((item, index) => {
              console.log(item, '11');
              return (
                <RecentSearchItem
                  searchKeyword={textInput}
                  {...item}
                  key={index + item.address}
                />
              );
            })}
        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
}
export default function KeywordSearch() {
  return (
    <DashboardLayout displaySidebar={false} title={'Explore'}>
      <MainContent />
    </DashboardLayout>
  );
}
