import React from 'react';
import {
  VStack,
  Box,
  HStack,
  Icon,
  Text,
  Link,
  Button,
  Image,
  Center,
  Hidden,
  useColorModeValue,
  useColorMode,
  useTheme,
  Pressable,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import GuestLayout from '../../layouts/GuestLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function Header() {
  return (
    <HStack space="2" px="1" py="4" alignItems="center">
      <Pressable
        onPress={() => {
          console.log('hello');
        }}
      >
        <Icon
          alignItems="center"
          justifyContent="center"
          size="6"
          as={MaterialIcons}
          name="keyboard-backspace"
          color="coolGray.50"
        />
      </Pressable>
      <Text color="coolGray.50" fontSize="lg">
        Forgot Password
      </Text>
    </HStack>
  );
}

function SendLink() {
  return (
    <Box alignItems="center" pt="4" marginTop="auto">
      <HStack space="1">
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.400' }}
          fontWeight="normal"
          fontSize="sm"
        >
          Send
        </Text>
        <Link
          _text={{
            fontWeight: 'bold',
            textDecorationLine: 'none',
          }}
          _hover={{
            _text: {
              color: 'primary.500',
            },
          }}
          _light={{
            _text: {
              color: 'primary.900',
            },
          }}
          _dark={{
            _text: {
              color: 'primary.500',
            },
          }}
        >
          OTP
        </Link>
      </HStack>
    </Box>
  );
}
function SideContainerWeb() {
  const key = useColorModeValue('1', '2');

  return (
    <Center
      flex={{ md: 1 }}
      pt={{ base: 9, md: '190' }}
      pb={{ base: '52', md: '190' }}
      px={{ base: 4, md: '50' }}
      _light={{ bg: { base: 'white', md: 'primary.900' } }}
      _dark={{ bg: { base: 'coolGray.800', md: 'primary.700' } }}
      borderTopLeftRadius={{ md: 'md' }}
      borderBottomLeftRadius={{ md: 'md' }}
    >
      <Image
        resizeMode={'contain'}
        height={40}
        width={56}
        key={key}
        _light={{ source: require('./images/WebLightMode.png') }}
        _dark={{ source: require('./images/WebDarkMode.png') }}
        alt="Alternate Text"
      />
    </Center>
  );
}
function MobileScreenImage() {
  const key = useColorModeValue('1', '2');

  return (
    <Center
      py={{ base: 12, md: '190' }}
      px={{ base: 4, md: 12 }}
      _light={{ bg: { base: 'white', md: 'primary.900' } }}
      _dark={{ bg: { base: 'coolGray.800', md: 'primary.700' } }}
      borderTopRightRadius={{ md: 'md' }}
      borderBottomRightRadius={{ md: 'md' }}
      mb="-0.5"
    >
      <Image
        resizeMode={'contain'}
        height={40}
        width={56}
        key={key}
        _light={{ source: require('./images/MobileLightMode.png') }}
        _dark={{ source: require('./images/MobileDarkMode.png') }}
        alt="Alternate Text"
      />
    </Center>
  );
}

export default function ForgotPassword() {
  const [text, setText] = React.useState('');
  const { colorMode } = useColorMode();
  const { colors } = useTheme();

  return (
    <>
      <GuestLayout>
        <Box _light={{ bg: 'white' }} _dark={{ bg: 'coolGray.800' }} flex={1}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            enableOnAndroid={true}
          >
            <VStack
              flexDirection={{ md: 'row' }}
              flex={1}
              _light={{ bg: 'primary.900' }}
              _dark={{ bg: 'coolGray.900' }}
            >
              <Hidden from="md">
                <Header />
              </Hidden>
              <Hidden till="md">
                <SideContainerWeb />
              </Hidden>
              <Hidden from="md">
                <MobileScreenImage />
              </Hidden>
              <Box
                pt={{ base: '0', md: '8' }}
                pb="8"
                px={{ base: '4', md: '8' }}
                _light={{ bg: 'white' }}
                _dark={{ bg: 'coolGray.800' }}
                flex="1"
                borderTopRightRadius={{ md: 'md' }}
                borderBottomRightRadius={{ md: 'md' }}
              >
                <Box flex={1} justifyContent="space-between">
                  <Box>
                    <VStack
                      space={4}
                      alignItems={{ md: 'left', base: 'center' }}
                    >
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="bold"
                        _dark={{ color: 'coolGray.50' }}
                        _light={{ color: 'coolGray.800' }}
                        textAlign={{ base: 'center', md: 'left' }}
                      >
                        Forgot Password?
                      </Text>
                      <Text
                        _light={{ color: 'coolGray.800' }}
                        _dark={{ color: 'coolGray.400' }}
                        fontSize="sm"
                        fontWeight="normal"
                        textAlign={{ base: 'center', md: 'left' }}
                      >
                        Not to worry! Enter email address associated with your
                        account and we’ll send a link to reset your password.
                      </Text>
                    </VStack>
                    <VStack space="8" mt="9">
                      <FloatingLabelInput
                        isRequired
                        label="Email"
                        labelColor={colors.coolGray[400]}
                        labelBGColor={
                          colorMode === 'light' ? 'white' : colors.coolGray[800]
                        }
                        defaultValue={text}
                        onChangeText={(txt: string) => setText(txt)}
                      />
                      <Button
                        variant="solid"
                        size="lg"
                        onPress={() => console.log('submit logic')}
                      >
                        SUBMIT
                      </Button>
                    </VStack>
                  </Box>
                  <SendLink />
                </Box>
              </Box>
            </VStack>
          </KeyboardAwareScrollView>
        </Box>
      </GuestLayout>
    </>
  );
}
