import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Pressable,
  Input,
  IconButton,
  Divider,
  Button,
  Hidden,
  SectionList,
  Fab,
} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

import DashboardLayout from '../../layouts/DashboardLayout';

type ContactProps = {
  imageUri: ImageSourcePropType;
  name: string;
  email: string;
  contactNumber: string;
};

type ListItemProps = {
  contact: ContactProps;
};

const DATA = [
  {
    category: 'Favourites',
    group: null,
    data: [
      {
        imageUri: require('../../assets/kristin.png'),
        name: 'Kristin Watson',
        email: 'Kristinwatson@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        imageUri: require('../../assets/william.png'),
        name: 'William James',
        email: 'Williamjames@gmail.com',
        contactNumber: '(480) 555-0103',
      },
    ],
  },
  {
    category: 'Contacts',
    group: 'A',
    data: [
      {
        imageUri: require('../../assets/alan.png'),
        name: 'Alan Watson',
        email: 'Alanwatson@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        imageUri: require('../../assets/anny.png'),
        name: 'Anny Geller',
        email: 'Annygeller@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        imageUri: require('../../assets/aeromy.png'),
        name: 'Aeromy Watson',
        email: 'Alerowatson@gmail.com',
        contactNumber: '(480) 555-0103',
      },
    ],
  },
  {
    category: 'Contacts',
    group: 'B',
    data: [
      {
        group: 'B',
        imageUri: require('../../assets/brandy.png'),
        name: 'Brandy Watson',
        email: 'Brandywatson@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        group: 'B',
        imageUri: require('../../assets/bell.png'),
        name: 'Bell',
        email: 'Bell@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        group: 'B',
        imageUri: require('../../assets/brandy.png'),
        name: 'Brandy Watson',
        email: 'Brandywatson@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        group: 'B',
        imageUri: require('../../assets/bell.png'),
        name: 'Bell',
        email: 'Bell@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        group: 'B',
        imageUri: require('../../assets/bell.png'),
        name: 'Bell',
        email: 'Bell@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        group: 'B',
        imageUri: require('../../assets/brandy.png'),
        name: 'Brandy Watson',
        email: 'Brandywatson@gmail.com',
        contactNumber: '(480) 555-0103',
      },
      {
        group: 'B',
        imageUri: require('../../assets/bell.png'),
        name: 'Bell',
        email: 'Bell@gmail.com',
        contactNumber: '(480) 555-0103',
      },
    ],
  },
];

function ContactItemMobile({ contact }: ListItemProps) {
  return (
    <Pressable px={4}>
      <HStack alignItems="center" space={4}>
        <Avatar source={contact.imageUri} w={10} h={10}>
          JD
        </Avatar>

        <Text
          fontWeight="normal"
          fontSize="md"
          lineHeight="24"
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
        >
          {contact.name}
        </Text>
      </HStack>
    </Pressable>
  );
}

function ContactItem({ contact }: ListItemProps) {
  return (
    <Pressable flex={1}>
      <HStack
        px={6}
        py={4}
        space={2}
        borderBottomWidth={1}
        alignItems="center"
        justifyContent="space-between"
        _light={{ borderBottomColor: 'coolGray.200' }}
        _dark={{ borderBottomColor: 'coolGray.700' }}
      >
        <HStack alignItems="center" space={2.5} flex={1}>
          <Avatar source={contact.imageUri} w={8} h={8}>
            JD
          </Avatar>

          <Text
            fontWeight="medium"
            fontSize="sm"
            lineHeight="21"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            w="full"
          >
            {contact.name}
          </Text>
        </HStack>
        <HStack flex={1}>
          <Text
            flex={1}
            fontWeight="medium"
            fontSize="sm"
            lineHeight="21"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            w="full"
          >
            {contact.email}
          </Text>
        </HStack>
        <Text
          flex={1}
          fontWeight="medium"
          fontSize="sm"
          lineHeight="21"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          w="full"
        >
          {contact.contactNumber}
        </Text>

        <IconButton
          variant="ghost"
          colorScheme="light"
          icon={
            <Icon
              size="5"
              _light={{ color: 'coolGray.800' }}
              _dark={{ color: 'coolGray.50' }}
              name={'dots-vertical'}
              as={MaterialCommunityIcons}
            />
          }
        />
      </HStack>
    </Pressable>
  );
}
export default function ContactList() {
  const ALPHABETS: string[] = [...Array(26)].map((val, i) =>
    String.fromCharCode(i + 65)
  );

  return (
    <>
      <DashboardLayout
        displaySidebar
        displayScreenTitle={false}
        title="My Contacts"
      >
        <VStack flex={1} rounded={{ md: 'sm' }}>
          <Hidden from="md">
            <VStack
              zIndex={2}
              position="absolute"
              alignItems="center"
              right={5}
              top={3}
              mt={16}
            >
              <Icon
                size={5}
                _light={{ color: 'primary.800' }}
                _dark={{ color: 'primary.800' }}
                as={MaterialIcons}
                name="favorite"
              />

              {ALPHABETS.map((item, index) => (
                <Pressable key={index}>
                  <Text fontSize="xs" fontWeight="normal" mt={1}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </VStack>
          </Hidden>
          <Hidden from="md">
            <Fab
              position="absolute"
              size="sm"
              icon={
                <Icon
                  size={6}
                  color="white"
                  as={MaterialIcons}
                  name={'dialpad'}
                />
              }
            />
          </Hidden>

          <ContactData />
        </VStack>
      </DashboardLayout>
    </>
  );
}

const ContactData = () => {
  const [searchText, setSearchText] = React.useState('');
  const [contactData, setContactData] = React.useState(DATA);

  React.useEffect(() => {
    const result = filterSearch(searchText);
    setContactData(result);
  }, [searchText]);

  function filterSearch(txt: string) {
    const filteredData: any[] = [];
    DATA.map((_data) => {
      const groupData = _data.data.filter((item) => {
        if (
          item.name.toLowerCase().includes(txt.toLowerCase()) ||
          item.email.toLowerCase().includes(txt.toLowerCase()) ||
          item.contactNumber.toLowerCase().includes(txt.toLowerCase())
        ) {
          return {
            ...item,
          };
        }
      });
      if (groupData.length > 0) {
        filteredData.push({
          ..._data,
          data: groupData,
        });
      }
    });
    return filteredData;
  }
  return (
    <>
      <Hidden from="md">
        <Box
          _light={{
            bg: 'white',
          }}
          _dark={{
            bg: 'coolGray.800',
          }}
          flex={1}
        >
          <Input
            pr={3}
            py={3}
            my={5}
            mx={4}
            value={searchText}
            onChangeText={(txt) => {
              setSearchText(txt);
            }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="search" />}
                ml={3}
                size="6"
                _light={{ color: 'coolGray.400' }}
                _dark={{ color: 'coolGray.300' }}
              />
            }
            placeholder="Search"
            fontSize="md"
            fontWeight="medium"
          />
          <SectionList
            keyExtractor={(item, index) => item.name + index}
            sections={contactData}
            contentContainerStyle={{ flexGrow: 1 }}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section: { category, group } }) => {
              if (!group)
                return (
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    mb="4"
                    px={4}
                    lineHeight="21"
                    _light={{ color: 'primary.900' }}
                    _dark={{ color: 'primary.500' }}
                  >
                    {category}
                  </Text>
                );
              return (
                <HStack alignItems="center" px={4}>
                  <Text
                    fontWeight="normal"
                    _light={{ color: 'coolGray.900' }}
                    _dark={{ color: 'coolGray.50' }}
                    my={5}
                    lineHeight="24"
                  >
                    {group}
                  </Text>
                  <Divider
                    ml={2}
                    mr={8}
                    _light={{ bg: 'coolGray.200' }}
                    _dark={{ bg: 'coolGray.700' }}
                    flex={1}
                  />
                </HStack>
              );
            }}
            renderItem={({ item }) => {
              return <ContactItemMobile contact={item} />;
            }}
            ItemSeparatorComponent={() => <Box h="4" />}
          />
        </Box>
      </Hidden>
      <Hidden till="md">
        <VStack space="4">
          <HStack flexWrap={'wrap'} flex={1} justifyContent="space-between">
            <Input
              value={searchText}
              onChangeText={(txt) => {
                setSearchText(txt);
              }}
              py={2}
              pl={3}
              _light={{
                bg: 'white',
                borderColor: 'coolGray.300',
              }}
              _dark={{
                bg: 'coolGray.800',
                borderColor: 'coolGray.500',
              }}
              size="md"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="search" />}
                  size={6}
                  ml={3}
                  _light={{
                    color: 'coolGray.400',
                  }}
                  _dark={{
                    color: 'coolGray.300',
                  }}
                />
              }
              placeholder="Search"
            />
            <HStack space={4}>
              <Button
                flex={1}
                _light={{
                  _text: { color: 'primary.900' },
                  bg: 'primary.50',
                  _hover: { bg: 'white' },
                  _pressed: { bg: 'white' },
                  borderColor: 'primary.800',
                }}
                _dark={{
                  bg: 'coolGray.700',
                  _hover: { bg: 'coolGray.800' },
                  _pressed: { bg: 'coolGray.800' },
                  borderColor: 'coolGray.400',
                }}
                variant="outline"
              >
                ADD SORT
              </Button>

              <Button flex={1} size="lg" variant="solid">
                ADD CONTACT
              </Button>
            </HStack>
          </HStack>
          <VStack
            _light={{
              bg: 'white',
            }}
            _dark={{
              bg: 'coolGray.800',
            }}
            divider={<Divider />}
            borderRadius={{ md: 'sm' }}
          >
            <HStack
              alignItems="center"
              justifyContent="space-between"
              px="6"
              pt="6"
              pb="4"
            >
              <Text
                ml="1px"
                fontWeight="bold"
                fontSize="sm"
                textAlign="left"
                flex={1}
                color="coolGray.500"
                lineHeight="17.5"
              >
                Name
              </Text>
              <Text
                ml="1px"
                fontWeight="bold"
                fontSize="sm"
                textAlign="left"
                flex={1}
                color="coolGray.500"
                lineHeight="17.5"
              >
                Email
              </Text>
              <Text
                ml="1px"
                fontWeight="bold"
                fontSize="sm"
                textAlign="left"
                flex={1}
                color="coolGray.500"
                lineHeight="17.5"
              >
                Phone Number
              </Text>
              <Text w={10} />
            </HStack>
            <SectionList
              contentContainerStyle={{
                paddingBottom: 32,
              }}
              keyExtractor={(item, index) => index + ''}
              sections={contactData}
              renderItem={({ item }) => {
                return <ContactItem contact={item} />;
              }}
            />
          </VStack>
        </VStack>
      </Hidden>
    </>
  );
};
