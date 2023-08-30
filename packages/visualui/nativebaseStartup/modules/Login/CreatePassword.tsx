import React, { useState } from 'react';
import {
  VStack,
  Box,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  Button,
  Image,
  IconButton,
  Center,
  Hidden,
  FormControl,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import GuestLayout from '../../layouts/GuestLayout';

export default function CreatePassword() {
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  function Header() {
    return (
      <HStack space="2" px="1" my="4" alignItems="center">
        <IconButton
          p={0}
          icon={
            <Icon
              alignItems="center"
              justifyContent="center"
              size="6"
              as={MaterialIcons}
              name="keyboard-backspace"
              color="coolGray.50"
            />
          }
        />
        <Text color="coolGray.50" fontSize="lg">
          Create Password
        </Text>
      </HStack>
    );
  }

  function ScreenText() {
    return (
      <VStack space={{ base: '3', md: '4' }}>
        <Text
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="bold"
          _dark={{ color: 'coolGray.50' }}
          _light={{ color: 'coolGray.800' }}
        >
          Create new password
        </Text>
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.400' }}
          fontSize="sm"
          letterSpacing="0.5"
        >
          Your new password must be different from previous used passwords and
          must be of at least 8 characters.
        </Text>
      </VStack>
    );
  }

  function WebSideContainer() {
    return (
      <Center
        flex="1"
        _light={{ bg: 'primary.900' }}
        _dark={{ bg: 'primary.700' }}
        px={{ base: '4', md: '8' }}
        borderTopLeftRadius={{ md: 'md' }}
        borderBottomLeftRadius={{ md: 'md' }}
      >
        <Image
          h="24"
          size="80"
          alt="NativeBase Startup+ "
          resizeMode={'contain'}
          source={require('./images/logo.png')}
        />
      </Center>
    );
  }
  return (
    <GuestLayout>
      <Hidden from="md">
        <Header />
      </Hidden>
      <Hidden till="md">
        <WebSideContainer />
      </Hidden>
      <Box
        pt={{ base: '8', md: '8' }}
        pb={{ base: 4, md: 8 }}
        px={{ base: '4', md: '8' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex="1"
        borderTopRightRadius={{ md: 'md' }}
        borderBottomRightRadius={{ md: 'md' }}
      >
        <Box flex="1">
          <ScreenText />
          <VStack mt={{ base: 7, md: 8 }} space={7}>
            <FormControl>
              <FloatingLabelInput
                isRequired
                secureTextEntry={showPass ? false : true}
                label="Password"
                defaultValue={pass}
                labelColor="#9CA3AF"
                onChangeText={(txt: string) => setPass(txt)}
                labelBGColor={useColorModeValue('#fff', '#1F2937')}
                InputRightElement={
                  <IconButton
                    mr="3"
                    variant="unstyled"
                    icon={
                      <Icon
                        size="5"
                        color="coolGray.400"
                        as={MaterialIcons}
                        name={showPass ? 'visibility' : 'visibility-off'}
                      />
                    }
                    onPress={() => {
                      setShowPass(!showPass);
                    }}
                  />
                }
              />
              <FormControl.HelperText
                _light={{
                  _text: { color: 'coolGray.500', letterSpacing: 0.6 },
                }}
                _dark={{
                  _text: { color: 'coolGray.400', letterSpacing: 0.6 },
                }}
              >
                Must be at least 8 characters.
              </FormControl.HelperText>
            </FormControl>
            <FormControl>
              <FloatingLabelInput
                isRequired
                secureTextEntry={showConfirmPass ? false : true}
                labelColor="#9CA3AF"
                label="Confirm Password"
                defaultValue={confirmPass}
                onChangeText={(txt: string) => setConfirmPass(txt)}
                labelBGColor={useColorModeValue('#fff', '#1F2937')}
                InputRightElement={
                  <IconButton
                    mr="3"
                    variant="unstyled"
                    icon={
                      <Icon
                        size="5"
                        color="coolGray.400"
                        as={MaterialIcons}
                        name={showConfirmPass ? 'visibility' : 'visibility-off'}
                      />
                    }
                    onPress={() => {
                      setShowConfirmPass(!showConfirmPass);
                    }}
                  />
                }
              />
              <FormControl.HelperText
                _light={{
                  _text: { color: 'coolGray.500', letterSpacing: 0.6 },
                }}
                _dark={{
                  _text: { color: 'coolGray.400', letterSpacing: 0.6 },
                }}
              >
                Both passwords must match.
              </FormControl.HelperText>
            </FormControl>
          </VStack>
        </Box>
        <Button variant="solid" size="lg" mt={{ base: 'auto', md: 24 }}>
          UPDATE PASSWORD
        </Button>
      </Box>
    </GuestLayout>
  );
}
