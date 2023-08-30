import React from 'react';
import { HStack, Text, Box, Pressable, Icon, IIconProps } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MaterialIcons } from '@expo/vector-icons';

type OptionItemProps = {
  name: string;
  iconName: string;
  iconType: IIconProps;
};

const settings: OptionItemProps[] = [
  {
    name: 'Storage',
    iconName: 'storage',
    iconType: MaterialIcons,
  },
  {
    name: 'About',
    iconName: 'perm-device-information',
    iconType: MaterialIcons,
  },
  {
    name: 'Help',
    iconName: 'help',
    iconType: MaterialIcons,
  },
  {
    name: 'Legal',
    iconName: 'policy',
    iconType: MaterialIcons,
  },
  {
    name: 'Terms and Conditions',
    iconName: 'text-snippet',
    iconType: MaterialIcons,
  },
];
function OptionItem({ name, iconName, iconType }: OptionItemProps) {
  return (
    <Pressable
      px={4}
      py={3}
      rounded={{ md: 'md' }}
      _light={{
        _hover: { bg: 'primary.100' },
        _pressed: { bg: 'primary.200' },
      }}
      _dark={{
        _hover: { bg: 'coolGray.700' },
        _pressed: { bg: 'coolGray.600' },
      }}
    >
      <HStack alignItems="center" space={4}>
        <Icon
          as={iconType}
          name={iconName}
          size={5}
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        />
        <Text
          fontSize="md"
          fontWeight="normal"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          {name}
        </Text>
      </HStack>
    </Pressable>
  );
}
export default function () {
  return (
    <DashboardLayout title="General Settings" rightPanelMobileHeader={true}>
      <Box
        px={{ base: 0, md: 4 }}
        py={{ base: 3, md: 5 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        {settings.map((setting, index) => {
          return <OptionItem key={index} {...setting} />;
        })}
      </Box>
    </DashboardLayout>
  );
}
