import React from 'react';
import {
  HStack,
  VStack,
  Avatar,
  useColorModeValue,
  Button,
  IconButton,
  Circle,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const FormComponent = () => {
  const [name, setName] = React.useState('John Legend');
  const [email, setEmail] = React.useState('jondoe@example.com');
  const [contact, setContact] = React.useState('8239635900');
  const [address, setAddress] = React.useState('301, Bakers Street');
  const [city, setCity] = React.useState('Rochester');
  const [state, setState] = React.useState('New York');
  const [country, setCountry] = React.useState('USA');
  const [code, setCode] = React.useState('11357');

  const labelStyle = {
    labelColor: '#9CA3AF',
    labelBGColor: useColorModeValue('#fff', '#1F2937'),
  };
  return (
    <VStack space={{ base: 6, md: 8 }}>
      <VStack mt={{ base: 5, md: 5 }} space={6}>
        <FloatingLabelInput
          value={name}
          onChangeText={setName}
          isRequired
          label="Full Name"
          {...labelStyle}
        />

        <FloatingLabelInput
          isRequired
          label="Email"
          {...labelStyle}
          value={email}
          onChangeText={setEmail}
        />
        <FloatingLabelInput
          keyboardType="numeric"
          isRequired
          label="Contact Number"
          {...labelStyle}
          value={contact}
          onChangeText={setContact}
        />
        <FloatingLabelInput
          isRequired
          label="Address"
          {...labelStyle}
          value={address}
          onChangeText={setAddress}
        />
      </VStack>
      <HStack
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
      >
        <FloatingLabelInput
          mb={{ base: 6, md: 0 }}
          w="100%"
          containerWidth={{ base: '100%', md: '48%' }}
          isRequired
          borderRadius="4"
          label="City"
          {...labelStyle}
          value={city}
          onChangeText={setCity}
        />
        <FloatingLabelInput
          w="100%"
          containerWidth={{ base: '100%', md: '48%' }}
          isRequired
          label="State"
          {...labelStyle}
          value={state}
          onChangeText={setState}
        />
      </HStack>
      <HStack
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
      >
        <FloatingLabelInput
          mb={{ base: 6, md: 0 }}
          w="100%"
          containerWidth={{ base: '100%', md: '48%' }}
          isRequired
          label="Zip code"
          {...labelStyle}
          value={code}
          onChangeText={setCode}
        />
        <FloatingLabelInput
          mb={{ base: 4, md: 0 }}
          w="100%"
          containerWidth={{ base: '100%', md: '48%' }}
          isRequired
          label="Country"
          {...labelStyle}
          value={country}
          onChangeText={setCountry}
        />
      </HStack>
    </VStack>
  );
};
export default function EditAccount() {
  return (
    <DashboardLayout title="Edit Details">
      <KeyboardAwareScrollView bounces={false}>
        <VStack
          px={{ base: 4, md: 8, lg: 32 }}
          py={{ base: 5, md: 8 }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
          rounded={{ md: 'sm' }}
          space={{ base: 6, md: 8 }}
          flex={1}
        >
          <HStack
            mb={{ base: 0, md: -3 }}
            alignItems="center"
            justifyContent={{ md: 'space-between', base: 'space-around' }}
          >
            <Avatar source={require('../../assets/jandoe.png')} w="24" h="24">
              <Circle
                position="absolute"
                left={10}
                bottom={-8}
                _light={{ bg: 'coolGray.50' }}
                _dark={{ bg: 'coolGray.700', borderColor: 'coolGray.700' }}
                alignItems="center"
                justifyContent="center"
                height={5}
                width={5}
              >
                <IconButton
                  onPress={() => {}}
                  ml={{ base: 1.5, md: 0 }}
                  variant="unstyled"
                  _icon={{
                    color: 'coolGray.400',
                    size: { base: 3, md: 4 },
                    as: MaterialIcons,
                    name: 'photo-camera',
                  }}
                />
              </Circle>
            </Avatar>
          </HStack>
          <FormComponent />

          <Button size="lg" mt={{ base: 'auto', md: 'auto' }} variant="solid">
            SAVE
          </Button>
        </VStack>
      </KeyboardAwareScrollView>
    </DashboardLayout>
  );
}
