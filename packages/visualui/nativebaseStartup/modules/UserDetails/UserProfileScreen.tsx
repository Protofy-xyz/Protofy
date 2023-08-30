import React from 'react';
import {
  HStack,
  Icon,
  VStack,
  Avatar,
  Button,
  Text,
  Hidden,
  IconButton,
  ScrollView,
  Box,
  Circle,
  useTheme,
  useColorMode,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import DashboardLayout from '../../layouts/DashboardLayout';

const bgColor = '#1f2937';

type IconProps = {
  iconName: string;
  iconText: string;
};

const IconList: IconProps[] = [
  {
    iconName: 'person',
    iconText: 'Contacts',
  },
  {
    iconName: 'groups',
    iconText: 'Groups',
  },
  {
    iconName: 'notifications',
    iconText: 'Notification',
  },
  {
    iconName: 'shopping-bag',
    iconText: 'Order',
  },
  {
    iconName: 'settings',
    iconText: 'Settings',
  },
  {
    iconName: 'policy',
    iconText: 'Privacy Policies',
  },
  {
    iconName: 'support-agent',
    iconText: 'Help & Support',
  },
  {
    iconName: 'share',
    iconText: 'Refer & Earn',
  },
  {
    iconName: 'exit-to-app',
    iconText: 'Logout',
  },
];

function OptionList() {
  return (
    <Box mt={2.5}>
      {IconList.map((item, idx) => {
        return (
          <Button
            key={idx}
            variant="ghost"
            justifyContent="flex-start"
            py="3"
            px="5"
            _light={{
              _text: { color: 'coolGray.800' },
              _icon: { color: 'coolGray.800' },
              _hover: {
                _text: {
                  color: 'primary.900',
                },
                _icon: {
                  color: 'primary.900',
                },
                bg: 'primary.100',
              },
            }}
            _dark={{
              _text: { color: 'coolGray.50' },
              _icon: { color: 'coolGray.50' },
              _hover: {
                _text: {
                  color: 'primary.500',
                },
                _icon: {
                  color: 'primary.500',
                },
                bg: 'coolGray.700',
              },
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium',
            }}
            leftIcon={
              <Icon size={5} mr={2} as={MaterialIcons} name={item.iconName} />
            }
          >
            {item.iconText}
          </Button>
        );
      })}
    </Box>
  );
}

function WebDisplay() {
  const { colors } = useTheme();
  const { colorMode } = useColorMode();

  return (
    <VStack space={4}>
      <HStack alignItems="center" justifyContent="space-between">
        <Avatar source={require('./images/janedoe.png')} w="24" h="24">
          <Avatar.Badge
            _light={{ bg: 'coolGray.50' }}
            _dark={{ bg: 'coolGray.700', borderColor: 'coolGray.700' }}
            p={2}
            alignItems="center"
            justifyContent="center"
          >
            <Circle>
              <IconButton
                p={0}
                icon={
                  <Icon
                    size={3}
                    as={MaterialIcons}
                    name={'photo-camera'}
                    color="coolGray.400"
                  />
                }
              />
            </Circle>
          </Avatar.Badge>
        </Avatar>
        <Button
          variant="outline"
          startIcon={
            <Icon
              as={MaterialIcons}
              name="mode-edit"
              _light={{
                color: 'primary.900',
              }}
              _dark={{
                color: 'coolGray.400',
              }}
              color="#45268F"
              size={5}
            />
          }
        >
          Edit Profile
        </Button>
      </HStack>
      <Box mt={16}>
        <FloatingLabelInput
          w="100%"
          isRequired
          label="Full Name"
          labelColor={colors.coolGray['400']}
          defaultValue={'Jon'}
          labelBGColor={colorMode === 'light' ? 'white' : bgColor}
        />
      </Box>
      <VStack mt={6} space={7}>
        <FloatingLabelInput
          isRequired
          label="Email"
          labelColor={colors.coolGray['400']}
          defaultValue={'jondoe@example.com'}
          labelBGColor={colorMode === 'light' ? 'white' : bgColor}
        />
        <FloatingLabelInput
          isRequired
          label="Contact Number"
          labelColor={colors.coolGray['400']}
          defaultValue={'+91-8239635900'}
          labelBGColor={colorMode === 'light' ? 'white' : bgColor}
        />
        <FloatingLabelInput
          isRequired
          label="Address"
          labelColor={colors.coolGray['400']}
          defaultValue={'301, Bakers Street'}
          labelBGColor={colorMode === 'light' ? 'white' : bgColor}
        />
        <HStack alignItems="center" justifyContent="space-between">
          <FloatingLabelInput
            w="100%"
            label="City"
            defaultValue={'Rochester'}
            containerWidth="48%"
            isRequired
            labelColor={colors.coolGray['400']}
            labelBGColor={colorMode === 'light' ? 'white' : bgColor}
          />
          <FloatingLabelInput
            w="100%"
            isRequired
            label="State"
            defaultValue={'New York'}
            labelColor={colors.coolGray['400']}
            labelBGColor={colorMode === 'light' ? 'white' : bgColor}
            containerWidth="48%"
          />
        </HStack>
        <HStack alignItems="center" justifyContent="space-between">
          <FloatingLabelInput
            w="100%"
            isRequired
            label="Zip Code"
            defaultValue={'11357'}
            labelColor={colors.coolGray['400']}
            labelBGColor={colorMode === 'light' ? 'white' : bgColor}
            containerWidth="48%"
          />
          <FloatingLabelInput
            w="100%"
            isRequired
            label="Country"
            defaultValue={'USA'}
            labelColor={colors.coolGray['400']}
            labelBGColor={colorMode === 'light' ? 'white' : bgColor}
            containerWidth="48%"
          />
        </HStack>
      </VStack>
    </VStack>
  );
}

function MobileScreen() {
  return (
    <>
      <Box
        pb={6}
        pt={1}
        alignItems="center"
        _light={{ bg: 'primary.900' }}
        _dark={{ bg: 'coolGray.900' }}
      >
        <Avatar
          source={require('./images/janedoe.png')}
          width={20}
          height={20}
        />

        <HStack alignItems="center" justifyContent="center" space={2} mt={3.5}>
          <Text fontSize="xl" fontWeight="bold" color="coolGray.50">
            Jane Doe
          </Text>
          <IconButton
            p={0}
            icon={
              <Icon
                as={MaterialIcons}
                name="mode-edit"
                size={5}
                color="coolGray.50"
              />
            }
          />
        </HStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          textAlign="center"
          _light={{ color: 'primary.300' }}
          _dark={{ color: 'coolGray.400' }}
        >
          janedoe2@mydomain.com
        </Text>
      </Box>
      <ScrollView>
        <OptionList />
      </ScrollView>
    </>
  );
}

export default function () {
  return (
    <DashboardLayout title="Profile" rightPanelMobileHeader={true}>
      <Box
        px={{ md: '140' }}
        pt={{ md: 8 }}
        pb={{ md: '140' }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex="1"
      >
        <Hidden till="md">
          <WebDisplay />
        </Hidden>
        <Hidden from="md">
          <MobileScreen />
        </Hidden>
      </Box>
    </DashboardLayout>
  );
}
