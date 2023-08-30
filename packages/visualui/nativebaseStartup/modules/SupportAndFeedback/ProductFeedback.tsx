import React, { useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Button,
  TextArea,
  Link,
  Center,
  Pressable,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type StarIconProps = {
  index: number;
  selected: number;
  setSelected: (arg0: number) => void;
};

type ProductType = {
  imageUri: ImageSourcePropType;
  itemName: string;
  itemCompany: string;
  price: string;
};

const item: ProductType = {
  imageUri: require('./images/Product1.png'),
  itemName: 'Sweater dress',
  itemCompany: 'Girls self design',
  price: '₹1,199',
};

function ItemCard() {
  return (
    <Link href="" borderRadius="sm" overflow="hidden">
      <HStack
        space={3}
        p={3}
        borderRadius="sm"
        _light={{ bg: 'coolGray.100' }}
        _dark={{ bg: 'coolGray.700' }}
        w="full"
      >
        <Image
          source={item.imageUri}
          alt="Product Image"
          height="90"
          width="74"
          borderRadius="md"
        />
        <Box>
          <Text
            fontSize="md"
            fontWeight="bold"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            {item.itemName}
          </Text>
          <Text
            fontSize="sm"
            _dark={{ color: 'coolGray.400' }}
            _light={{ color: 'coolGray.500' }}
          >
            {item.itemCompany}
          </Text>
          <Text
            fontWeight="medium"
            fontSize="sm"
            _dark={{ color: 'coolGray.50' }}
            _light={{ color: 'coolGray.800' }}
            mt="auto"
          >
            {item.price}
          </Text>
        </Box>
      </HStack>
    </Link>
  );
}
function RateStar(props: StarIconProps) {
  return (
    <Pressable
      onPress={() => {
        props.setSelected(props.index);
      }}
    >
      <Icon
        size={6}
        p={0}
        as={MaterialIcons}
        name="star-outline"
        _dark={{
          color: props.selected < props.index ? 'coolGray.400' : 'amber.400',
        }}
        _light={{
          color: props.selected < props.index ? 'coolGray.500' : 'amber.400',
        }}
      />
    </Pressable>
  );
}

function AddPhoto() {
  const [image, setImage] = useState('');

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
      p={{ base: 4, md: 0 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
        fontWeight="medium"
        mb="3"
      >
        Add Photo or Video
      </Text>
      <Center
        width="100%"
        height="116"
        _light={{ borderColor: 'coolGray.300' }}
        _dark={{ borderColor: 'coolGray.700' }}
        borderWidth="1"
        borderRadius="sm"
        borderStyle="dashed"
      >
        <Pressable alignItems="center" onPress={pickImage}>
          {image === '' ? (
            <>
              <Icon
                as={MaterialCommunityIcons}
                name="cloud-upload-outline"
                color="coolGray.400"
                size={6}
              />
              <Text fontSize="sm" mt="0.5" color="coolGray.400">
                Upload
              </Text>
            </>
          ) : (
            <Image
              alt="upload image"
              source={{ uri: image }}
              width="100"
              height="100"
            />
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
      p={{ base: 4, md: 0 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{ color: 'coolGray.800' }}
        _dark={{ color: 'coolGray.50' }}
      >
        Share your experience
      </Text>
      <TextArea
        value={name}
        onChangeText={setName}
        h={119}
        mt={3}
        placeholder="Would you like to write about the product?"
        _light={{ borderColor: 'coolGray.300' }}
        _dark={{ borderColor: 'coolGray.700' }}
        placeholderTextColor="coolGray.400"
      />
    </Box>
  );
}
function SubmitButton() {
  return (
    <Button mt="auto" size="lg" variant="solid" mx={{ base: 4, md: 0 }}>
      SUBMIT
    </Button>
  );
}
function MainContent() {
  const [selected, setSelected] = useState(-1);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
      enableOnAndroid={true}
      extraScrollHeight={150}
    >
      <VStack
        flex={1}
        space={{ base: 4, md: 8 }}
        _light={{ bg: { md: 'white' } }}
        _dark={{ bg: { base: 'coolGray.700', md: 'coolGray.800' } }}
        px={{ base: 0, md: 8, lg: 35 }}
        pt={{ base: 0, md: 8 }}
        pb={{ base: 4, md: 8 }}
        rounded={{ md: 'sm' }}
      >
        <Box
          p={{ base: 4, md: 0 }}
          _light={{ bg: 'white' }}
          _dark={{ bg: 'coolGray.800' }}
        >
          <ItemCard />
          <VStack space="3" mt={{ base: 6, md: 8 }}>
            <Text
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              fontWeight="medium"
              fontSize="sm"
            >
              Rate your experience
            </Text>
            <HStack alignItems="center" space="4">
              {Array.from({ length: 5 }, (_, index) => (
                <RateStar
                  key={index}
                  index={index}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </HStack>
            <Text fontSize="sm" color="coolGray.400">
              Tap the stars
            </Text>
          </VStack>
        </Box>
        <AddPhoto />
        <Description />
        <SubmitButton />
      </VStack>
    </KeyboardAwareScrollView>
  );
}
export default function () {
  return (
    <DashboardLayout title={'Feedback'}>
      <MainContent />
    </DashboardLayout>
  );
}
