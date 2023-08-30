import React from 'react';
import { HStack, Text, Switch, Image, Box } from 'native-base';

import DashboardLayout from '../../layouts/DashboardLayout';
import { ImageSourcePropType, Platform } from 'react-native';

type LinkedAccountProp = {
  imageUri: ImageSourcePropType;
  text: string;
  isChecked: boolean;
};

const itemList: LinkedAccountProp[] = [
  {
    imageUri: require('./images/facebook.png'),
    text: 'Facebook',
    isChecked: true,
  },
  {
    imageUri: require('./images/twitter.png'),
    text: 'Twitter',
    isChecked: false,
  },
  {
    imageUri: require('./images/google.png'),
    text: 'Google',
    isChecked: false,
  },
  {
    imageUri: require('./images/apple.png'),
    text: 'Apple',
    isChecked: false,
  },
];

const LinkedAccountCard = ({
  text,
  imageUri,
  isChecked,
}: LinkedAccountProp) => {
  const [isSwitchChecked, setIsSwitchChecked] = React.useState(isChecked);
  return (
    <HStack px={4} py={3} alignItems="center" space="3">
      <Image
        h="5"
        w="5"
        alt="NativeBase Startup+ "
        resizeMode={'contain'}
        source={imageUri}
      />
      <Text
        fontSize="md"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        {text}
      </Text>
      <Switch
        size={Platform.OS === 'ios' ? 'sm' : 'md'}
        isChecked={isSwitchChecked}
        onValueChange={() => setIsSwitchChecked(!isSwitchChecked)}
        _light={{
          onThumbColor: 'white',
          offThumbColor: 'white',
          offTrackColor: 'coolGray.200',
          onTrackColor: 'primary.900',
        }}
        _dark={{
          onThumbColor: 'white',
          offThumbColor: 'white',
          offTrackColor: 'coolGray.700',
          onTrackColor: 'primary.700',
        }}
        ml="auto"
      />
    </HStack>
  );
};

export default function LinkedAccounts() {
  return (
    <DashboardLayout title="Linked Accounts">
      <Box
        py={{ base: 3, md: 5 }}
        px={{ base: 0, md: 4 }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        rounded={{ md: 'sm' }}
      >
        {itemList.map((item, index) => {
          return <LinkedAccountCard key={index} {...item} />;
        })}
      </Box>
    </DashboardLayout>
  );
}
