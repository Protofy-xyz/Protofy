import React, { useState } from 'react';
import {
  Button,
  HStack,
  VStack,
  Text,
  Link,
  Checkbox,
  Divider,
  Image,
  useColorModeValue,
  IconButton,
  Icon,
  Center,
  Hidden,
  Box,
  FormControl,
  IInputProps,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import GuestLayout from '../../layouts/GuestLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const FormInput = ({
  children,
  ...props
}: IInputProps & {
  label?: string;
  labelBGColor?: string;
  labelColor?: string;
  containerWidth?: string | number;
  children?: JSX.Element | JSX.Element[];
}) => (
  <VStack mb="6">
    <FloatingLabelInput {...props} />
    {children}
  </VStack>
);

const SignInForm = ({onSubmit}) => {
  type FormData = {
    email: string;
    password: string;
  };
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPass, setShowPass] = React.useState(false);

  return (
    <FormControl>
      <FormInput
        isRequired
        label="Email"
        labelColor="#9CA3AF"
        labelBGColor={useColorModeValue('#fff', '#1F2937')}
        defaultValue={formData.email}
        onChangeText={(email: string) =>
          setFormData((prev) => ({ ...prev, email: email }))
        }
      >
        <FormControl.ErrorMessage>
          Please enter a valid email
        </FormControl.ErrorMessage>
      </FormInput>
      <FormInput
        isRequired
        secureTextEntry={!showPass}
        label="Password"
        labelColor="#9CA3AF"
        labelBGColor={useColorModeValue('#fff', '#1F2937')}
        defaultValue={formData.password}
        onChangeText={(newPassword: string) =>
          setFormData((prev) => ({ ...prev, password: newPassword }))
        }
        InputRightElement={
          <IconButton
            mr="1"
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
      >
        <FormControl.ErrorMessage>Invalid password</FormControl.ErrorMessage>
      </FormInput>
      {/* <Link
        // href="https://nativebase.io"
        ml="auto"
        _text={{
          fontSize: { base: 'sm', md: 'xs' },
          fontWeight: 'bold',
          textDecoration: 'none',
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
        Forgot password?
      </Link> */}
      <Checkbox
        value="demo"
        defaultIsChecked
        accessibilityLabel="Remember me"
        my="5"
        _text={{
          fontSize: 'sm',
          fontWeight: 'normal',
          pl: '3',
        }}
        _dark={{
          value: 'checkbox',
          _checked: {
            value: 'checkbox',
            bg: 'primary.700',
            borderColor: 'primary.700',
            _icon: { color: 'white' },
          },
          _text: {
            color: 'coolGray.400',
          },
        }}
        _light={{
          value: 'checkbox',
          _checked: {
            value: 'checkbox',
            bg: 'primary.900',
            borderColor: 'primary.900',
          },
          _text: {
            color: 'coolGray.800',
          },
        }}
      >
        Remember me and keep me logged in
      </Checkbox>
      <Button onPress={() => onSubmit(formData)} variant="solid" size="lg" mt={{ base: 5, md: 3 }}>
        SIGN IN
      </Button>
    </FormControl>
  );
};

const SignInComponent = ({onSubmit}) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ flex: 1 }}
      bounces={false}
    >
      <MobileHeader />
      <Box
        px={{ base: 4, md: 8 }}
        py="8"
        flex={1}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        borderTopLeftRadius={{ base: '2xl', md: 0 }}
        borderTopRightRadius={{ base: '2xl', md: 'md' }}
        borderBottomRightRadius={{ base: 'none', md: 'md' }}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          mb={8}
        >
          Sign in to continue
        </Text>
        <SignInForm onSubmit={onSubmit}/>
        {/* <HStack my={4} space="2" alignItems="center" justifyContent="center">
          <Divider
            w="30%"
            _light={{ bg: 'coolGray.200' }}
            _dark={{ bg: 'coolGray.700' }}
          />
          <Text
            fontWeight="medium"
            _light={{
              color: 'coolGray.400',
            }}
            _dark={{
              color: 'coolGray.300',
            }}
          >
            or
          </Text>
          <Divider
            w="30%"
            _light={{ bg: 'coolGray.200' }}
            _dark={{ bg: 'coolGray.700' }}
          />
        </HStack>
        <HStack
          mt={{ base: 6, md: 4 }}
          justifyContent="center"
          alignItems={'center'}
          space="4"
        >
          <Link href="https://nativebase.io">
            <Image
              width="6"
              height="6"
              source={require('./images/facebook.png')}
              alt="Alternate Text"
            />
          </Link>
          <Link href="https://nativebase.io">
            <Image
              width="6"
              height="6"
              source={require('./images/GoogleLogo.png')}
              alt="Alternate Text"
            />
          </Link>
        </HStack> */}
        <HStack
          space="1"
          safeAreaBottom
          alignItems="center"
          justifyContent="center"
          mt={{ base: 'auto', md: '8' }}
        >
          <Text
            fontSize="sm"
            fontWeight="normal"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            Don't have an account?
          </Text>
          <Link
            href="/register"
            _text={{
              fontSize: { base: 'sm', md: 'xs' },
              fontWeight: 'bold',
              textDecoration: 'none',
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
            Sign Up
          </Link>
        </HStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

function SideContainerWeb() {
  return (
    <Center
      flex="1"
      _light={{ bg: 'primary.800' }}
      _dark={{ bg: 'primary.700' }}
      borderTopLeftRadius={{ md: 'md' }}
      borderBottomLeftRadius={{ md: 'md' }}
    >
      <Image
        h="24"
        size="80"
        alt="Protofy Cloud"
        resizeMode={'contain'}
        source={require('../../../assets/logo.png')}
      />
    </Center>
  );
}

function MobileHeader() {
  return (
    <Hidden from="md">
      <VStack px="4" mt="4" mb="5" space="9">
        <HStack space="2" alignItems="center">
          <IconButton
            p={0}
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name="keyboard-backspace"
                color="coolGray.50"
              />
            }
          />
          <Text color="coolGray.50" fontSize="lg">
            Sign In
          </Text>
        </HStack>
        <VStack space={0.5}>
          <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
            Protofy Cloud
          </Text>
          <Text
            fontSize="md"
            fontWeight="normal"
            _dark={{
              color: 'coolGray.400',
            }}
            _light={{
              color: 'primary.300',
            }}
          >

          </Text>
        </VStack>
      </VStack>
    </Hidden>
  );
}
export default function SignIn({onSubmit}) {
  return (
    <GuestLayout>
      <Hidden till="md">
        <SideContainerWeb />
      </Hidden>

      <SignInComponent onSubmit={onSubmit} />
    </GuestLayout>
  );
}
