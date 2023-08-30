import React from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  ScrollView,
  Divider,
  Button,
  Box,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';

type AddressType = {
  place: string;
  subAddress: string;
};

const addresses: AddressType[] = [
  {
    place: 'Home',
    subAddress: '4517 Washington Ave. Manchester, Kentucky',
  },
  {
    place: 'Work',
    subAddress: '8502 Preston Rd. Inglewood, Maine 98380',
  },
];

function AddressCard({ place, subAddress }: AddressType) {
  return (
    <HStack space="2">
      <Icon
        size={6}
        name={'location-on'}
        as={MaterialIcons}
        _light={{ color: 'primary.900' }}
        _dark={{ color: 'primary.500' }}
      />
      <VStack space="2">
        <Text
          fontSize="lg"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          lineHeight="27"
        >
          {place}
        </Text>
        <Text
          fontSize="sm"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          lineHeight="21"
        >
          {subAddress}
        </Text>
        <HStack space="4" mt="1">
          <Button
            variant="solid"
            px={4}
            py={2}
            _text={{
              fontSize: 'sm',
              fontWeight: 'medium',
              color: 'secondary.50',
            }}
            startIcon={
              <Icon
                size={4}
                name="edit"
                as={MaterialIcons}
                color="secondary.50"
              />
            }
          >
            Edit
          </Button>
          <Button
            px={4}
            py={2}
            variant="outline"
            borderColor="secondary.400"
            _text={{
              fontSize: 'sm',
              fontWeight: 'medium',
              color: 'secondary.400',
            }}
            startIcon={<Icon size={4} name="delete" as={MaterialIcons} />}
            _icon={{ color: 'secondary.400' }}
            _hover={{
              _text: { color: 'coolGray.50' },
              _icon: { color: 'coolGray.50' },
            }}
            _pressed={{
              _text: { color: 'coolGray.50' },
              _icon: { color: 'coolGray.50' },
            }}
          >
            Delete
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
}

function MainContent() {
  return (
    <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
      <Box
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        px={{ base: 4, md: 32, lg: 35 }}
        py={{ base: 5, md: 10 }}
        flex={1}
      >
        <Text
          fontWeight="medium"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          lineHeight="21"
        >
          Saved Addresses
        </Text>
        <VStack mt="4" space="6" divider={<Divider />}>
          {addresses.map((address, index) => (
            <AddressCard key={index} {...address} />
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}

export default function () {
  return (
    <DashboardLayout
      title="Manage Addresses"
      displayMenuButton
      displayNotificationButton
      displaySidebar={false}
      rightPanelMobileHeader={true}
    >
      <MainContent />
    </DashboardLayout>
  );
}
