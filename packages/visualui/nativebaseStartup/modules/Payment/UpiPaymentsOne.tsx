import React, { useRef } from 'react';
import {
  Box,
  HStack,
  Image,
  Icon,
  Text,
  VStack,
  Button,
  Pressable,
  Input,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function Pin() {
  const [show, setShow] = React.useState(false);
  const firstInput = useRef<HTMLDivElement>(null);
  const secondInput = useRef<HTMLDivElement>(null);
  const thirdInput = useRef<HTMLDivElement>();
  const fourthInput = useRef<HTMLDivElement>();

  const refList = [firstInput, secondInput, thirdInput, fourthInput];

  const handleClick = () => setShow(!show);
  return (
    <VStack space="7" my="8">
      <HStack space="2" mx={10} justifyContent="center">
        {[1, 2, 3].map((i: number) => (
          <Input
            secureTextEntry={!show}
            keyboardType="numeric"
            width={{ base: '20%', md: '15%', lg: '10%' }}
            textAlign="center"
            variant="unstyled"
            maxLength={1}
            borderBottomWidth="2"
            ref={refList[i - 1]}
            onChangeText={(text) => {
              if (text.length === 1) {
              refList[i].current?.focus();}
            }}
            rounded={0}
            _light={{ color: 'coolGray.800', borderBottomColor: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400', borderBottomColor: 'coolGray.100' }}
          />
        ))}
        <Input
          secureTextEntry={!show}
          keyboardType="numeric"
          width={{ base: '20%', md: '15%', lg: '10%' }}
          textAlign="center"
          variant="unstyled"
          maxLength={1}
          borderBottomWidth="2"
          ref={fourthInput}
          _light={{ color: 'coolGray.800', borderBottomColor: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400', borderBottomColor: 'coolGray.100' }}
          rounded={0}
        />
      </HStack>
      <Box justifyContent="center" alignItems="center">
        <Pressable>
          <HStack alignItems="center" space="2">
            <Pressable onPress={handleClick} flexDir="row">
              {show ? (
                <Icon
                  as={MaterialIcons}
                  name="visibility"
                  size="22"
                  color="coolGray.400"
                />
              ) : (
                <Icon
                  as={MaterialIcons}
                  name="visibility-off"
                  size="22"
                  color="coolGray.400"
                />
              )}

              <Text
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                fontSize="sm"
                ml="1"
              >
                {show ? 'Show' : "Don't Show"}
              </Text>
            </Pressable>
          </HStack>
        </Pressable>
      </Box>
    </VStack>
  );
}
export default function UpiPaymentsOne() {
  return (
    <DashboardLayout title="UPI Payment" displaySidebar={false}>
      <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <VStack
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        flex={1}
        justifyContent="space-between"
        alignItems="center"
        pt={{ md: '20', base: 10 }}
        pb={{ md: '8', base: 4 }}
        safeAreaBottom
        rounded={{ md: 'sm' }}
        px={{ base: '4', md: '140px' }}
      >
        <VStack alignItems="center">
          <Image
            _light={{ source: require('./images/Payment2.png') }}
            _dark={{ source: require('./images/Payment2Dark.png') }}
            alt="Alternate Text"
            width="122"
            height="170"
          />
          <VStack space="2" alignItems="center" mt={9}>
            <Text
              fontSize="md"
              fontWeight="medium"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
            >
              Enter 4-Digit UPI PIN
            </Text>
            <Text
              _light={{ color: 'coolGray.500' }}
              _dark={{ color: 'coolGray.400' }}
              fontSize="sm"
            >
              Sending to kevinjohn@okaxis
            </Text>
          </VStack>
          <Pin />
        </VStack>
        <Box width="100%" mt="auto">
          <Button variant="solid" size="lg">
            PROCEED
          </Button>
        </Box>
      </VStack>
      </KeyboardAwareScrollView>
    </DashboardLayout>
  );
}
