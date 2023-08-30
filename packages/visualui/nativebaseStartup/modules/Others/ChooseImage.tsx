import React from 'react';
import {
  Text,
  VStack,
  Image,
  useBreakpointValue,
  FlatList,
  Hidden,
  HStack,
  Pressable,
  Icon,
  Box,
  Button,
} from 'native-base';
import { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

import { MaterialIcons } from '@expo/vector-icons';

type ImageList = {
  imageUri: ImageSourcePropType;
};
type CardProps = {
  item: ImageList;
};

const folder: ImageList[] = [
  {
    imageUri: null,
  },
  {
    imageUri: require('./images/archived-2.png'),
  },
  {
    imageUri: require('./images/archived-3.png'),
  },
  {
    imageUri: require('./images/archived-4.png'),
  },
];
function Card(props: CardProps) {
  return (
    <>
      {props.item.imageUri ? (
        <Pressable
          mx={2}
          width={{ base: '29%', md: '25%', lg: '20%' }}
          onPress={() => {
            console.log('hello');
          }}
        >
          <Image
            width="full"
            h={{ base: '165', md: '216' }}
            mt={4}
            rounded="sm"
            source={props.item.imageUri}
            alt="Alternate Text"
          />
        </Pressable>
      ) : (
        <Box mx={2} width={{ base: '29%', md: '25%', lg: '20%' }}>
          <Box
            h={{ base: '165', md: '216' }}
            mt={4}
            rounded="sm"
            _dark={{ bg: 'coolGray.700' }}
            _light={{ bg: 'primary.100' }}
            alignItems="center"
            justifyContent="center"
          >
            <Pressable>
              <Icon
                as={MaterialIcons}
                name="file-upload"
                size="6"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
              />
            </Pressable>
            {props.item.imageUri === null ? (
              <Hidden only={['base']}>
                <Text
                  mt="2"
                  fontSize={{ md: 'sm' }}
                  _dark={{
                    color: 'coolGray.50',
                  }}
                  _light={{ color: 'coolGray.800' }}
                >
                  Upload Photo
                </Text>
              </Hidden>
            ) : null}
          </Box>
        </Box>
      )}
    </>
  );
}

function MainContent() {
  const noColumn = useBreakpointValue({
    base: 3,
    md: 4,
    lg: 5,
  });
  return (
    <FlatList
      ListHeaderComponent={
        <HStack alignItems="center" space="0.5" px="2">
          <Text
            fontSize="lg"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
          >
            Recents
          </Text>
          <Pressable>
            <Icon
              size="6"
              as={MaterialIcons}
              name={'keyboard-arrow-down'}
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            />
          </Pressable>
        </HStack>
      }
      numColumns={noColumn}
      data={folder}
      renderItem={({ item }) => <Card item={item} />}
      key={noColumn}
      keyExtractor={(item, index) => 'key' + index}
      bounces={false}
    />
  );
}
export default function () {
  return (
    <DashboardLayout
      displayScreenTitle={true}
      displaySidebar={false}
      title="Choose image"
    >
      <VStack
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex="1"
        pt={{ base: '4', md: '8' }}
        pb={{ base: '5', md: '8' }}
        px={{ base: '2', md: '6' }}
        rounded={{ md: 'sm' }}
      >
        <MainContent />
        <Button variant="solid" mt={{ base: 'auto', md: 'auto' }}>
          CONTINUE
        </Button>
      </VStack>
    </DashboardLayout>
  );
}
