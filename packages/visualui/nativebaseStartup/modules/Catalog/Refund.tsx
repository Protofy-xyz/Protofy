import React, { useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Pressable,
  FormControl,
  TextArea,
  Input,
  Hidden,
  Divider,
  Button,
  Link,
  Center,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageSourcePropType } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type ProductProps = {
  id: string;
  imageUri: ImageSourcePropType;
  item: string;
  details: string;
  amount: string;
};
const productList: ProductProps[] = [
  {
    id: '1',
    imageUri: require('./images/sweater.png'),
    item: 'Sweater dress',
    details: ' Girls self design',
    amount: '₹1,199',
  },
];
function Card(props: ProductProps) {
  return (
    <HStack
      space="3"
      borderRadius="sm"
      _light={{ bg: 'coolGray.100' }}
      _dark={{ bg: 'coolGray.700' }}
      p={3}
    >
      <Link href="" borderRadius="sm" overflow="hidden">
        <Image
          source={props.imageUri}
          alt="Alternate Text"
          height="90"
          width="74"
        />
      </Link>
      <Link href="" isUnderlined={false}>
        <Box>
          <Text
            fontSize="md"
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {props.item}
          </Text>
          <Text
            fontSize="sm"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
          >
            {props.details}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            mt="auto"
          >
            {props.amount}
          </Text>
        </Box>
      </Link>
    </HStack>
  );
}
function CardSection() {
  return (
    <VStack
      space="3"
      _light={{ bg: { base: 'white' } }}
      _dark={{ bg: { base: 'coolGray.800' } }}
      px={{ base: 4, md: 0 }}
      pt={{ base: 5, md: 0 }}
      pb="2"
    >
      {productList.map((item, index) => {
        return <Card key={index} {...item} />;
      })}
      <Pressable>
        <HStack py="3" justifyContent="space-between" alignItems="center">
          <Text
            fontSize="md"
            fontWeight="medium"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            Select reason
          </Text>
          <Icon
            as={MaterialIcons}
            name={'arrow-forward-ios'}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            size="4"
          />
        </HStack>
      </Pressable>
    </VStack>
  );
}
function AddPhoto() {
  const [image, setImage] = useState<string>('');

  const pickImage = async () => {
    const result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <Box
      mt={{ base: 4, md: 6 }}
      px={{ base: 4, md: 0 }}
      py={{ base: 4, md: 0 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Add Photo or Video
      </Text>

      <Center
        width="100%"
        height="116"
        _light={{ borderColor: 'coolGray.300' }}
        _dark={{ borderColor: 'coolGray.700' }}
        borderWidth="1"
        borderStyle="dashed"
        mt={{ base: 3 }}
      >
        <Pressable alignItems="center" onPress={pickImage}>
          {image === '' ? (
            <>
              <Icon
                as={MaterialIcons}
                name={'cloud-upload'}
                color="coolGray.400"
                size="6"
              />
              <Text
                fontSize="sm"
                mt="0.5"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                Upload
              </Text>
            </>
          ) : (
            <Image source={{ uri: image }} width="100" height="100" />
          )}
        </Pressable>
      </Center>
    </Box>
  );
}
function Description() {
  const [name, setName] = React.useState('');
  return (
    <Box
      mt={{ base: 4, md: 8 }}
      py={{ base: 4, md: 0 }}
      px={{ base: 4, md: 0 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Description
      </Text>
      <TextArea
        value={name}
        onChangeText={setName}
        h="119"
        mt={3}
        placeholder="Refund Reason (optional)"
        _light={{ placeholderTextColor: 'coolGray.500' }}
        _dark={{ placeholderTextColor: 'coolGray.400' }}
      />
    </Box>
  );
}
function RefundAmount() {
  const [refundAmount, setRefundAmount] = useState('');
  return (
    <Box
      mt={{ base: 4, md: 8 }}
      py={{ base: 4, md: 0 }}
      px={{ base: 4, md: 0 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Refund Amount
      </Text>
      <FormControl isRequired mt={{ base: 3 }}>
        <Input
          keyboardType="numeric"
          value={refundAmount}
          onChangeText={setRefundAmount}
          placeholder="Enter amount you want to be refunded"
          _light={{ placeholderTextColor: 'coolGray.500' }}
          _dark={{ placeholderTextColor: 'coolGray.400' }}
          py={3}
        />
      </FormControl>
    </Box>
  );
}
function EmailAddress() {
  const [emailId, setEmailId] = useState('');
  return (
    <Box
      mt={{ base: 4, md: 8 }}
      py={{ base: 4, md: 0 }}
      px={{ base: 4, md: 0 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Email Address
      </Text>
      <FormControl isRequired mt="3">
        <Input
          placeholder="Enter your email address"
          value={emailId}
          onChangeText={setEmailId}
          _light={{ placeholderTextColor: 'coolGray.500' }}
          _dark={{ placeholderTextColor: 'coolGray.400' }}
          py={3}
        />
      </FormControl>
    </Box>
  );
}
function SubmitButton() {
  return (
    <Button
      variant="solid"
      _text={{ fontWeight: 'medium' }}
      mx={{ base: 4, md: 0 }}
      mt={{ base: 4, md: 8 }}
    >
      SUBMIT
    </Button>
  );
}
function MainContent() {
  return (
    <Box
      _light={{ bg: { md: 'white' } }}
      _dark={{
        bg: { base: 'coolGray.700', md: 'coolGray.800' },
      }}
      px={{ base: 0, md: 8, lg: 24, xl: 140 }}
      rounded={{ md: 'sm' }}
      pt={{ base: 0, md: 8 }}
      pb={{ base: 4, md: 8 }}
    >
      <CardSection />
      <Hidden from="base" till="md">
        <Divider
          _light={{ bg: 'coolGray.200' }}
          _dark={{ bg: 'coolGray.700' }}
        />
      </Hidden>
      <AddPhoto />
      <Description />
      <RefundAmount />
      <EmailAddress />
      <SubmitButton />
    </Box>
  );
}

export default function Refund() {
  return (
    <DashboardLayout title="Refund order">
      <KeyboardAwareScrollView>
        <MainContent />
      </KeyboardAwareScrollView>
    </DashboardLayout>
  );
}
