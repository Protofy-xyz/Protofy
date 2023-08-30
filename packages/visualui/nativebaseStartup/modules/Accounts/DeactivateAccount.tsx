import React from 'react';
import {
  HStack,
  Text,
  VStack,
  Avatar,
  Button,
  Link,
  TextArea,
  useColorModeValue,
  Box,
  useTheme,
  FormControl,
} from 'native-base';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function MainContent() {
  type DeactivateForm = {
    reason: string;
    password: string;
  };

  const { colors } = useTheme();

  const [deactivateForm, setDeactivateForm] = React.useState<DeactivateForm>({
    reason: '',
    password: '',
  });

  const { reason, password } = deactivateForm;

  const confirmPassLabelBGColor = useColorModeValue(
    'white',
    colors.coolGray[800]
  );

  const handleFormUpdate = (name: string, value: string) =>
    setDeactivateForm((prev) => ({ ...prev, [name]: value }));

  return (
    <Box
      px={{ base: 4, md: 60, lg: 140 }}
      py={{ base: 4, md: 8 }}
      rounded={{ md: 'sm' }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
      flex={1}
    >
      <KeyboardAwareScrollView style={{ flex: 1 }} bounces={false}>
        <Box>
          <HStack space="3" alignItems="center">
            <Avatar source={require('../../assets/person3.png')} size={9} />
            <Box>
              <Text
                fontSize="sm"
                fontWeight="bold"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                lineHeight="21"
              >
                Chandler Bing
              </Text>
              <Text
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                fontSize="xs"
                fontWeight="normal"
                lineHeight="18"
              >
                chandlerbing@gmail.com
              </Text>
            </Box>
          </HStack>
          <FormControl>
            <VStack space="3" mt="6">
              <Text
                fontSize="md"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                lineHeight="24"
              >
                Why are you disabling your account?
              </Text>
              <TextArea
                fontSize="14"
                lineHeight="21"
                textAlignVertical="top"
                placeholderTextColor={useColorModeValue(
                  'coolGray.500',
                  'coolGray.400'
                )}
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                value={reason}
                onChangeText={(txt) => handleFormUpdate('reason', txt)}
                placeholder="Please enter the reason for disabling your account."
                h="168"
              />
            </VStack>
            <VStack mt="6" space="3">
              <Text
                fontSize="md"
                fontWeight="medium"
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
                lineHeight="24"
              >
                To continue, please re-enter your password
              </Text>
              <FloatingLabelInput
                isRequired
                type="password"
                label="Password"
                labelColor={colors.coolGray[400]}
                defaultValue={password}
                onChangeText={(txt: string) =>
                  handleFormUpdate('password', txt)
                }
                labelBGColor={confirmPassLabelBGColor}
              />
            </VStack>
            <Box mt="3">
              <Link
                href=""
                lineHeight="21"
                _text={{
                  textDecorationLine: 'none',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  _light: { color: 'primary.900' },
                  _dark: { color: 'primary.500' },
                }}
              >
                Forgot Password ?
              </Link>
              <Text
                mt={{ base: '4', md: '6' }}
                fontSize="sm"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
                lineHeight="21"
              >
                Note: If you disable, your account will reactivate the next time
                you sign in. Deleted accounts are gone forever. In either case,
                your account disappears.
              </Text>
            </Box>
          </FormControl>
        </Box>
      </KeyboardAwareScrollView>
      <Button size="lg" variant="solid" mt="36">
        CONFIRM
      </Button>
    </Box>
  );
}
export default function () {
  return (
    <DashboardLayout title="Disable Accounts">
      <MainContent />
    </DashboardLayout>
  );
}
