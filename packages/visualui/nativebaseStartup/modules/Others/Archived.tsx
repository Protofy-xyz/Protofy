import React from 'react';
import {
  Image,
  useBreakpointValue,
  FlatList,
  Hidden,
  Text,
  Pressable,
  Box,
} from 'native-base';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';

type Folder = {
  imageUri: ImageSourcePropType;
};

type CardProps = {
  item: Folder;
};

const folder: Folder[] = [
  {
    imageUri: require('./images/archived-1.png'),
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
  {
    imageUri: require('./images/archived-5.png'),
  },
  {
    imageUri: require('./images/archived-6.png'),
  },
  {
    imageUri: require('./images/archived-7.png'),
  },
  {
    imageUri: require('./images/archived-8.png'),
  },
  {
    imageUri: require('./images/archived-9.png'),
  },
  {
    imageUri: require('./images/archived-10.png'),
  },
  {
    imageUri: require('./images/archived-11.png'),
  },
  {
    imageUri: require('./images/archived-12.png'),
  },
  {
    imageUri: require('./images/archived-13.png'),
  },
  {
    imageUri: require('./images/archived-14.png'),
  },
  {
    imageUri: require('./images/archived-15.png'),
  },
  {
    imageUri: require('./images/archived-16.png'),
  },
  {
    imageUri: require('./images/archived-17.png'),
  },
  {
    imageUri: require('./images/archived-18.png'),
  },
  {
    imageUri: require('./images/archived-19.png'),
  },
  {
    imageUri: require('./images/archived-20.png'),
  },
];

function Card(props: CardProps) {
  return (
    <Pressable px={2} width={{ base: '33%', md: '25%', lg: '20%' }}>
      <Image
        width="full"
        h={{ base: 165, md: 216 }}
        mt={4}
        rounded="sm"
        source={props.item.imageUri}
        alt="Alternate Text"
      />
    </Pressable>
  );
}

function MainContent() {
  const { height } = useWindowDimensions();
  const noColumn = useBreakpointValue({
    base: 3,
    md: 4,
    lg: 5,
  });
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      pt={{ base: 1, md: 4 }}
      pb={{ base: 5, md: 8 }}
      px={{ base: 4, md: 8 }}
      rounded={{ md: 'sm' }}
    >
      <FlatList
        ListHeaderComponent={
          <Hidden from="md">
            <Text
              mt={3}
              fontSize="sm"
              textAlign="center"
              fontWeight="normal"
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
            >
              Only you can see the posts you’ve archived
            </Text>
          </Hidden>
        }
        numColumns={noColumn}
        data={folder}
        renderItem={({ item }) => <Card item={item} />}
        key={noColumn}
        keyExtractor={(item, index) => 'key' + index}
        bounces={false}
        _web={{
          height: { base: height, md: '100%' },
        }}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
}

export default function () {
  return (
    <DashboardLayout
      displayScreenTitle={true}
      displaySidebar={false}
      title="Archived"
      rightPanelMobileHeader={true}
    >
      <MainContent />
    </DashboardLayout>
  );
}
