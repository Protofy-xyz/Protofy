import React from 'react';
import {
  HStack,
  Icon,
  Text,
  Divider,
  VStack,
  Avatar,
  Hidden,
  Fab,
  Box,
  Pressable,
  Stack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type Contact = {
  name: string;
  mobile: string;
  home: string;
  email: string;
  state: string;
  country: string;
};

const contactOptions = [
  {
    icon: 'call',
    name: 'Call',
  },
  {
    icon: 'videocam',
    name: 'Video',
  },
  {
    icon: 'message',
    name: 'Message',
  },
  {
    icon: 'mail',
    name: 'Email',
  },
];

const contactDetail: Contact = {
  name: 'Alexander Leslie',
  state: 'New York',
  country: 'United States',
  email: 'Alexander20@gmail.com',
  mobile: '(316) 555-0116',
  home: '(316) 555-0116',
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Call':
    case 'Home':
      return 'call';
    case 'Email':
      return 'email';
    case 'Message':
      return 'message';
    case 'Mobile':
      return 'smartphone';
    case 'Video':
      return 'videocam';
    case 'Location':
      return 'location-on';
    default:
      return undefined;
  }
};

const ContactOptions = ({ name, icon }: { name: string; icon: string }) => (
  <Pressable alignItems="center">
    <Icon
      name={icon}
      as={MaterialIcons}
      size="6"
      _light={{
        color: { base: 'coolGray.50', md: 'coolGray.500' },
      }}
      _dark={{
        color: { base: 'coolGray.400', md: 'coolGray.500' },
      }}
      mb="2"
    />

    <Text
      _light={{
        color: { base: 'coolGray.50', md: 'coolGray.400' },
      }}
      _dark={{
        color: { base: 'coolGray.400', md: 'coolGray.400' },
      }}
      fontSize="md"
    >
      {name}
    </Text>
  </Pressable>
);

const ProfileCard = ({ name, country }: { name: string; country: string }) => {
  return (
    <Box
      pt={{ base: '18', md: '8' }}
      pb={6}
      _light={{
        bg: { base: 'primary.900', md: 'white' },
      }}
      _dark={{
        bg: { base: 'coolGray.900', md: 'coolGray.800' },
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Avatar
        width="20"
        height="20"
        source={require('../../assets/profile1.png')}
      />
      <Text
        mt={4}
        _light={{
          color: { base: 'coolGray.50', md: 'coolGray.800' },
        }}
        _dark={{
          color: { base: 'coolGray.50', md: 'coolGray.50' },
        }}
        fontSize="2xl"
        fontWeight="medium"
        lineHeight="36"
      >
        {name}
      </Text>
      <Text
        mt={0.5}
        color={{ base: 'coolGray.50', md: 'coolGray.500' }}
        fontSize="sm"
        lineHeight="21"
      >
        {country}
      </Text>
      <HStack space="10" mt={{ base: '5', md: '6' }} alignItems={'center'}>
        {contactOptions.map((contact, index) => {
          return <ContactOptions {...contact} key={index} />;
        })}
      </HStack>
    </Box>
  );
};

const ContactDetails = ({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) => (
  <HStack
    width={{ md: '100%', lg: '50%' }}
    px={{ base: 4, md: 4, lg: '12%' }}
    py={{ md: 0 }}
    space={{ base: 3 }}
    mt={{ lg: '7' }}
  >
    <Icon
      size="6"
      as={MaterialIcons}
      name={getIcon(label)}
      _dark={{ color: 'primary.500' }}
      _light={{ color: 'primary.800' }}
      mt="1"
      mr="2"
    />

    <VStack space="2">
      <Text
        fontSize="md"
        fontWeight="medium"
        _dark={{ color: 'coolGray.50' }}
        _light={{ color: 'coolGray.800' }}
      >
        {detail}
      </Text>
      <Text
        fontSize="md"
        fontWeight="medium"
        _dark={{ color: 'coolGray.400' }}
        _light={{ color: 'coolGray.500' }}
      >
        {label}
      </Text>
    </VStack>
  </HStack>
);

function Details({ mobile, home, email, state, country }: Contact) {
  return (
    <Box
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      alignItems={{ md: 'center' }}
      flex={1}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ md: 'center' }}
        justifyContent={{ md: 'space-evenly' }}
        flex={1}
        pb={{ lg: '200' }}
        py={{ base: 5, md: 3 }}
        flexWrap={{ md: 'wrap' }}
        space={{ base: 5, md: 0 }}
      >
        <ContactDetails label={'Mobile'} detail={mobile} />
        <ContactDetails label={'Home'} detail={home} />
        <ContactDetails label={'Email'} detail={email} />
        <ContactDetails label={'Location'} detail={`${state}, ${country}`} />
      </Stack>
    </Box>
  );
}

export default function () {
  return (
    <DashboardLayout title="My Contacts">
      <Box rounded={{ md: 'sm' }} flex={1}>
        <ProfileCard {...contactDetail} />
        <Hidden till="md">
          <Divider bg="coolGray.700" />
        </Hidden>
        <Details {...contactDetail} />
      </Box>
      <Hidden from="md">
        <Fab
          placement="bottom-right"
          size="16"
          icon={
            <Icon
              size="6"
              color="coolGray.50"
              as={MaterialIcons}
              name={'edit'}
            />
          }
          _light={{ bg: 'primary.900' }}
          _dark={{ bg: 'primary.700' }}
        />
      </Hidden>
    </DashboardLayout>
  );
}
