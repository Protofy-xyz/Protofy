import React from 'react';
import { HStack, Text, VStack, Icon, Pressable, Box } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';

type PrivacySetting = {
  title: string;
  defaultOption: string;
};

const settings: PrivacySetting[] = [
  { title: 'Blocked Users', defaultOption: 'None' },
  { title: 'Phone Number', defaultOption: 'Nobody' },
  { title: 'Last Seen & Online', defaultOption: 'My Contacts' },
  { title: 'Profile Photo', defaultOption: 'Nobody' },
  { title: 'Calls', defaultOption: 'My Contacts' },
  { title: 'Groups', defaultOption: 'Everybody' },
];

function OptionItem({ title, defaultOption }: PrivacySetting, key: number) {
  return (
    <Pressable
      px={4}
      py={2}
      rounded={{ md: 'md' }}
      _light={{
        _hover: { bg: 'primary.100' },
        _pressed: { bg: 'primary.200' },
      }}
      _dark={{
        _hover: { bg: 'coolGray.700' },
        _pressed: { bg: 'coolGray.600' },
      }}
      key={key}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <VStack space={1}>
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            lineHeight="24"
          >
            {title}
          </Text>
          <Text
            fontSize="xs"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            lineHeight="18"
          >
            {defaultOption}
          </Text>
        </VStack>

        <Icon
          as={MaterialIcons}
          name="chevron-right"
          size={6}
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        />
      </HStack>
    </Pressable>
  );
}
export default function () {
  return (
    <DashboardLayout title="Privacy Settings">
      <Box
        px={{ md: 4 }}
        py={{ base: 5, md: 4 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        {settings.map((setting, index) => (
          <OptionItem
            title={setting.title}
            defaultOption={setting.defaultOption}
            key={index}
          />
        ))}
      </Box>
    </DashboardLayout>
  );
}
