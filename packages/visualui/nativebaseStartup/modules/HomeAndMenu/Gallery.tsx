import React from 'react';
import { Text, Column, Image, FlatList, Box, Pressable, NativeBaseProvider } from 'native-base';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import DashboardLayout from 'baseapp/plugins/visualui/nativebaseStartup/layouts/DashboardLayout';
import Background from "baseapp/palettes/uikit/Background";
import currentTheme from "internalapp/themes/currentTheme";

type List = {
  imageUri: ImageSourcePropType;
  folderName: string;
};
type ListProps = {
  item: List;
};

const list: List[] = [
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery1.png'),
    folderName: 'All',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery2.png'),
    folderName: 'Camera',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery3.png'),
    folderName: 'Videos',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery4.png'),
    folderName: 'ScreenShots',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery5.png'),
    folderName: 'Bluetooth',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery6.png'),
    folderName: 'WhatsApp',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery7.png'),
    folderName: 'Facebook',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery8.png'),
    folderName: 'Download',
  },
  {
    imageUri: require('baseapp/plugins/visualui/nativebaseStartup/assets/gallery9.png'),
    folderName: 'Others',
  },
];

function Card(props: ListProps) {
  return (
    <Box w="100%" my={2} borderRadius="sm" overflow="hidden">
      <Image
        height={{ base: 98, md: 242 }}
        source={props.item.imageUri}
        alt="Alternate Text"
      />
      <Box
        py={{ base: 2, md: 3 }}
        px={3}
        _light={{ bg: 'coolGray.100' }}
        _dark={{ bg: 'coolGray.700' }}
      >
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="medium"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          {props.item.folderName}
        </Text>
      </Box>
    </Box>
  );
}

export default function ImagePicker() {
  const { height } = useWindowDimensions();
  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout displaySidebar={false} title="Gallery">
          <Column
            flex={1}
            px={{ base: 4, md: 8 }}
            py={{ base: 5, md: 6 }}
            rounded={{ md: 'sm' }}
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            space={4}
            alignItems="center"
          >
            <FlatList
              w="100%"
              numColumns={3}
              data={list}
              keyExtractor={(item, index) => 'key' + index}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              _web={{
                height: { base: height, md: '100%' },
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <Pressable key={index} width="32%">
                  <Card item={item} />
                </Pressable>
              )}
              bounces={false}
            />
          </Column>
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}
