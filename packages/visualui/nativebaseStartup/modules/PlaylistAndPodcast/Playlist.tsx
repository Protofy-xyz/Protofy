import React, { useEffect } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Actionsheet,
  Pressable,
  Divider,
  useDisclose,
  ScrollView,
  IconButton,
  Hidden,
  Slider,
  Tooltip,
  Progress,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Carousel } from '../../components/Carousel';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const StackNavigator = createStackNavigator();

type SongList = {
  songName: string;
  artist: string;
  imageUri: ImageSourcePropType;
  duration: string;
};
type SongListProps = {
  song: SongList;
};
type SongProps = {
  currentSongTab: SongList[];
};
type SongTabItemType = {
  Allsongs: SongList[];
  Favourites: SongList[];
  Albums: SongList[];
  Workouts: SongList[];
};
const songsList: SongTabItemType = {
  Allsongs: [
    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },

    {
      songName: 'Work',
      artist: 'One republic',
      imageUri: require('./images/work.png'),
      duration: '3:48',
    },

    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },

    {
      songName: 'Rescue Me',
      artist: 'One republic',
      imageUri: require('./images/rescueme.png'),
      duration: '3:30',
    },

    {
      songName: 'Apologize',
      artist: 'One republic',
      imageUri: require('./images/apologies.png'),
      duration: '3:27',
    },

    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },
  ],
  Favourites: [
    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },
    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },

    {
      songName: 'Work',
      artist: 'One republic',
      imageUri: require('./images/work.png'),
      duration: '3:48',
    },

    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },

    {
      songName: 'Rescue Me',
      artist: 'One republic',
      imageUri: require('./images/rescueme.png'),
      duration: '3:30',
    },

    {
      songName: 'Apologize',
      artist: 'One republic',
      imageUri: require('./images/apologies.png'),
      duration: '3:27',
    },

    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },
  ],
  Albums: [
    {
      songName: 'Work',
      artist: 'One republic',
      imageUri: require('./images/work.png'),
      duration: '3:48',
    },

    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },

    {
      songName: 'Rescue Me',
      artist: 'One republic',
      imageUri: require('./images/rescueme.png'),
      duration: '3:30',
    },
    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },

    {
      songName: 'Work',
      artist: 'One republic',
      imageUri: require('./images/work.png'),
      duration: '3:48',
    },

    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },

    {
      songName: 'Rescue Me',
      artist: 'One republic',
      imageUri: require('./images/rescueme.png'),
      duration: '3:30',
    },

    {
      songName: 'Apologize',
      artist: 'One republic',
      imageUri: require('./images/apologies.png'),
      duration: '3:27',
    },

    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },
  ],
  Workouts: [
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },

    {
      songName: 'Rescue Me',
      artist: 'One republic',
      imageUri: require('./images/rescueme.png'),
      duration: '3:30',
    },
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },

    {
      songName: 'Rescue Me',
      artist: 'One republic',
      imageUri: require('./images/rescueme.png'),
      duration: '3:30',
    },

    {
      songName: 'Apologize',
      artist: 'One republic',
      imageUri: require('./images/apologies.png'),
      duration: '3:27',
    },

    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },
    {
      songName: 'Secrets',
      artist: 'One republic',
      imageUri: require('./images/secrets.png'),
      duration: '3:36',
    },
    {
      songName: 'Work',
      artist: 'One republic',
      imageUri: require('./images/work.png'),
      duration: '3:48',
    },

    {
      songName: 'Counting stars',
      artist: 'One republic',
      imageUri: require('./images/songfull.png'),
      duration: '4:30',
    },

    {
      songName: 'Work',
      artist: 'One republic',
      imageUri: require('./images/work.png'),
      duration: '3:48',
    },
  ],
};

type FullScreenSongProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Icon = {
  iconName: string;
  iconText: string;
};

const footerIcons: Icon[] = [
  { iconName: 'home', iconText: 'Home' },
  { iconName: 'wifi-tethering', iconText: 'Podcast' },
  { iconName: 'search', iconText: 'Search' },
  { iconName: 'queue-music', iconText: 'My library' },
];
function CarouselLayout() {
  const { height } = useWindowDimensions();
  return (
    <Carousel
      images={[
        require('./images/image1.png'),
        require('./images/image2.png'),
        require('./images/image3.png'),
        require('./images/image4.png'),
      ]}
      activeIndicatorBgColor="primary.700"
      inactiveIndicatorBgColor="coolGray.300"
      height={height * 0.75}
    />
  );
}
function MobileHeader() {
  return (
    <Box alignItems="flex-start">
      <Image
        h="56"
        w="100%"
        resizeMode="cover"
        alt="Banner Image"
        source={require('./images/songbanner.png')}
      />
    </Box>
  );
}

function SongCard({ song }: SongListProps) {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <HStack alignItems="center" space={{ base: 3, md: 6 }}>
        <Image
          source={song.imageUri}
          alt="Song cover"
          boxSize="16"
          rounded="md"
        />
        <VStack>
          <Pressable>
            <Text fontSize="md" bold>
              {song.songName}
            </Text>
          </Pressable>
          <Text
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            fontWeight="normal"
            fontSize="sm"
          >
            {song.artist}
          </Text>
        </VStack>
      </HStack>
      <HStack alignItems="center" space={{ base: 2 }}>
        <Text color="coolGray.500">{song.duration}</Text>
        <Tooltip label="More Options" openDelay={500}>
          <IconButton
            p={0}
            icon={
              <Icon
                as={MaterialIcons}
                name="more-vert"
                size="6"
                color="coolGray.500"
              />
            }
          />
        </Tooltip>
      </HStack>
    </HStack>
  );
}

function FullScreenSong(props: FullScreenSongProps) {
  const window = useWindowDimensions();
  return (
    <Actionsheet
      isOpen={props.isOpen}
      onClose={props.onClose}
      hideDragIndicator
    >
      <Actionsheet.Content
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        h={window.height * 0.75}
        px={10}
        pt={8}
      >
        <Box flex={1}>
          <CarouselLayout />
        </Box>
        <VStack width="100%" pb={6} space={2} pt={4}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            textAlign="center"
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
          >
            Escape from reality
          </Text>
          <Text
            fontSize="sm"
            fontWeight="normal"
            _light={{ color: 'coolGray.500' }}
            _dark={{ color: 'coolGray.400' }}
            textAlign="center"
          >
            One republic
          </Text>
          <VStack>
            <Slider defaultValue={65}>
              <Slider.Track rounded="0">
                <Slider.FilledTrack
                  bg="primary.900"
                  _dark={{ bg: 'primary.700' }}
                />
              </Slider.Track>
            </Slider>
            <HStack justifyContent="space-between">
              <Text
                fontSize="sm"
                fontWeight="normal"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
              >
                1.25
              </Text>
              <Text
                fontSize="sm"
                fontWeight="normal"
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
              >
                3.25
              </Text>
            </HStack>
          </VStack>
          <HStack alignItems="center" justifyContent="center">
            <Tooltip label="Previous song" openDelay={500}>
              <IconButton
                variant="unstyled"
                icon={
                  <Icon
                    name="skip-previous"
                    as={MaterialIcons}
                    size={6}
                    _dark={{ color: 'coolGray.50' }}
                    _light={{ color: 'coolGray.800' }}
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Pause/Play" openDelay={500}>
              <IconButton
                variant="solid"
                _light={{ bg: 'primary.900', _pressed: { bg: 'primary.700' } }}
                _dark={{ bg: 'primary.500', _pressed: { bg: 'primary.400' } }}
                rounded="full"
                _icon={{ color: 'white', size: 6 }}
                icon={<Icon name="pause" as={MaterialIcons} />}
              />
            </Tooltip>
            <Tooltip label="Next Song" openDelay={500}>
              <IconButton
                variant="unstyled"
                _icon={{
                  _dark: { color: 'coolGray.50' },
                  _light: { color: 'coolGray.800' },
                  size: '6',
                }}
                icon={<Icon name="skip-next" as={MaterialIcons} />}
              />
            </Tooltip>
          </HStack>
          <HStack justifyContent="space-between" pt={3}>
            <Tooltip label="Songs list" openDelay={500}>
              <IconButton
                variant="ghost"
                _icon={{
                  _dark: { color: 'coolGray.50' },
                  _light: { color: 'coolGray.800' },
                  size: 6,
                }}
                icon={<Icon as={MaterialIcons} name="list" />}
              />
            </Tooltip>
            <Tooltip label="Add to favourites" openDelay={500}>
              <IconButton
                variant="ghost"
                _icon={{
                  _dark: { color: 'coolGray.50' },
                  _light: { color: 'coolGray.800' },
                  size: 6,
                }}
                icon={<Icon name="favorite-border" as={MaterialIcons} />}
              />
            </Tooltip>
            <Tooltip label="Shuffle" openDelay={500}>
              <IconButton
                variant="ghost"
                _icon={{
                  _dark: { color: 'coolGray.50' },
                  _light: { color: 'coolGray.800' },
                  size: 6,
                }}
                icon={<Icon name="shuffle" as={MaterialIcons} />}
              />
            </Tooltip>
            <Tooltip label="More" openDelay={500}>
              <IconButton
                variant="ghost"
                _icon={{
                  _dark: { color: 'coolGray.50' },
                  _light: { color: 'coolGray.800' },
                  size: 6,
                }}
                icon={<Icon name="more-horiz" as={MaterialIcons} />}
              />
            </Tooltip>
          </HStack>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
function DesktopMinimizedSong() {
  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      width="100%"
      shadow="9"
      _dark={{ bg: 'coolGray.700' }}
      _light={{ bg: 'coolGray.50' }}
    >
      <Slider defaultValue={65} mt="-3" zIndex={1}>
        <Slider.Track rounded="0" bg="transparent">
          <Slider.FilledTrack bg="primary.900" _dark={{ bg: 'primary.700' }} />
        </Slider.Track>
      </Slider>
      <HStack
        space={3}
        alignItems="center"
        px={8}
        pb={3}
        justifyContent="space-between"
      >
        <HStack alignItems="center" space={6}>
          <Image
            boxSize={10}
            rounded="md"
            source={{
              uri: 'https://i1.sndcdn.com/artworks-000040814493-eu3kr3-t500x500.jpg',
            }}
          />
          <VStack>
            <Text bold fontSize="md">
              Counting Stars
            </Text>
            <Text color="coolGray.500" _dark={{ color: 'coolGray.400' }}>
              One Republic
            </Text>
          </VStack>
        </HStack>
        <HStack alignItems="center" space={7}>
          <Tooltip label="Add to favourites" placement="top">
            <IconButton
              variant="ghost"
              icon={
                <Icon
                  name="favorite"
                  as={MaterialIcons}
                  size={5}
                  _dark={{ color: 'coolGray.50' }}
                  _light={{ color: 'coolGray.800' }}
                />
              }
            />
          </Tooltip>
          <HStack alignItems="center">
            <Tooltip label="Previous song" placement="top">
              <IconButton
                variant="unstyled"
                icon={
                  <Icon
                    name="skip-previous"
                    as={MaterialIcons}
                    size={5}
                    _dark={{ color: 'coolGray.50' }}
                    _light={{ color: 'coolGray.800' }}
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Pause/play" placement="top">
              <IconButton
                variant="solid"
                _light={{ bg: 'primary.900' }}
                _dark={{ bg: 'primary.500', _pressed: { bg: 'primary.400' } }}
                rounded="full"
                _icon={{ color: 'white' }}
                icon={<Icon name="pause" as={MaterialIcons} size={6} />}
              />
            </Tooltip>
            <Tooltip label="Next song" placement="top">
              <IconButton
                variant="unstyled"
                icon={
                  <Icon
                    name="skip-next"
                    as={MaterialIcons}
                    size="5"
                    _dark={{ color: 'coolGray.50' }}
                    _light={{ color: 'coolGray.800' }}
                  />
                }
              />
            </Tooltip>
          </HStack>
          <Tooltip label="Shuffle" placement="top">
            <IconButton
              variant="ghost"
              icon={
                <Icon
                  name="shuffle"
                  as={MaterialIcons}
                  size="6"
                  _dark={{ color: 'coolGray.50' }}
                  _light={{ color: 'coolGray.800' }}
                />
              }
            />
          </Tooltip>
        </HStack>

        <Tooltip label="More Options" placement="top">
          <IconButton
            icon={
              <Icon
                as={MaterialIcons}
                name="more-horiz"
                size={6}
                _dark={{ color: 'coolGray.50' }}
                _light={{ color: 'coolGray.800' }}
              />
            }
          />
        </Tooltip>
      </HStack>
    </Box>
  );
}

function MobileMinimizedSong() {
  const { isOpen, onOpen, onClose } = useDisclose();
  return (
    <VStack _light={{ bg: 'coolGray.50' }} _dark={{ bg: 'coolGray.700' }}>
      <Pressable
        onPress={onOpen}
        _light={{ bg: 'coolGray.50' }}
        _dark={{ bg: 'coolGray.700' }}
      >
        <Box px={4} pt={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space={3} alignItems="center">
              <Image
                boxSize="12"
                rounded="full"
                source={{
                  uri: 'https://i1.sndcdn.com/artworks-000040814493-eu3kr3-t500x500.jpg',
                }}
                alt="song-banner"
              />
              <VStack space={1}>
                <Text
                  _light={{ color: 'coolGray.800' }}
                  _dark={{ color: 'coolGray.50' }}
                  bold
                  fontSize="md"
                >
                  Counting Stars
                </Text>
                <Text
                  _light={{ color: 'coolGray.500' }}
                  _dark={{ color: 'coolGray.400' }}
                >
                  One Republic
                </Text>
              </VStack>
            </HStack>
            <HStack alignItems="center">
              <IconButton
                variant="unstyled"
                icon={
                  <Icon
                    _light={{ color: 'coolGray.800' }}
                    _dark={{ color: 'coolGray.50' }}
                    name="skip-previous"
                    as={MaterialIcons}
                    size="5"
                  />
                }
              />
              <IconButton
                variant="solid"
                _light={{ bg: 'primary.900', _pressed: { bg: 'primary.700' } }}
                _dark={{ bg: 'primary.500', _pressed: { bg: 'primary.400' } }}
                rounded="full"
                _icon={{ color: 'white' }}
                icon={<Icon name="pause" as={MaterialIcons} size={4} />}
              />
              <IconButton
                variant="unstyled"
                icon={<Icon name="skip-next" as={MaterialIcons} size={5} />}
              />
              <IconButton
                variant="unstyled"
                icon={
                  <Icon name="favorite-border" as={MaterialIcons} size={5} />
                }
              />
            </HStack>
          </HStack>
        </Box>
      </Pressable>
      <Progress
        mt={3}
        size="xs"
        value={64}
        rounded="xs"
        _light={{
          bg: 'coolGray.100',
          _filledTrack: { bg: 'primary.900' },
        }}
        _dark={{
          bg: 'coolGray.700',
          _filledTrack: { bg: 'primary.500' },
        }}
      />
      <FullScreenSong isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
}
function DesktopBanner() {
  return (
    <Box zIndex={-1}>
      <Image
        roundedTop="md"
        h="56"
        w="100%"
        resizeMode="cover"
        alt="Banner Image"
        source={require('./images/songbanner.png')}
      />
    </Box>
  );
}
function MobileFooter({ navigation }: { navigation: any }) {
  const route = useRoute();
  return (
    <Hidden from="md">
      <HStack
        justifyContent="space-between"
        safeAreaBottom
        height="20"
        width="100%"
        bottom="0"
        left="0"
        right="0"
        pt="5"
        px="10"
        alignSelf="center"
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: 'coolGray.800' }}
      >
        {footerIcons.map((item) => {
          return (
            <Pressable
              onPress={() => {
                navigation.navigate(item.iconText);
              }}
            >
              <VStack alignItems="center">
                <Icon
                  as={MaterialIcons}
                  name={item.iconName}
                  size="6"
                  _light={{
                    color:
                      route.name === item.iconText
                        ? 'primary.900'
                        : 'coolGray.400',
                  }}
                  _dark={{
                    color:
                      route.name === item.iconText
                        ? 'primary.500'
                        : 'coolGray.400',
                  }}
                />
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  _light={{
                    color:
                      route.name === item.iconText
                        ? 'primary.900'
                        : 'coolGray.400',
                  }}
                  _dark={{
                    color:
                      route.name === item.iconText
                        ? 'primary.500'
                        : 'coolGray.400',
                  }}
                >
                  {item.iconText}
                </Text>
              </VStack>
            </Pressable>
          );
        })}
      </HStack>
    </Hidden>
  );
}

const SongsList = (props: SongProps) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ flex: 1 }}
      bounces={false}
    >
      <VStack
        space={3}
        px={{ base: 4, md: 8 }}
        py={4}
        _dark={{ bg: { base: 'coolGray.800', md: 'coolGray.900' } }}
        _light={{ bg: 'white' }}
      >
        {props.currentSongTab.map(
          (song: SongList, index: React.Key | null | undefined) => {
            return (
              <VStack space={3} key={index}>
                <SongCard song={song} />
                {index !== props.currentSongTab.length - 1 && <Divider />}
              </VStack>
            );
          }
        )}
      </VStack>
    </ScrollView>
  );
};
const tabs = [
  {
    id: 1,
    title: 'Allsongs',
  },
  {
    id: 2,
    title: 'Favourites',
  },
  {
    id: 3,
    title: 'Albums',
  },
  {
    id: 4,
    title: 'Workouts',
  },
];
function TabItem({
  tabName,
  currentTab,
  handleTabChange,
  px,
}: {
  tabName: string;
  currentTab: string;
  handleTabChange: (tabTitle: string) => void;
  px?: { base?: string; md?: string; lg?: string };
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} pt="2">
      <VStack px={px}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
          }}
          _dark={{
            color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
          }}
          // px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            borderTopLeftRadius="sm"
            borderTopRightRadius="sm"
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            h="1"
          />
        )}
      </VStack>
    </Pressable>
  );
}

function PlaylistScreen({ navigation }: { navigation: any }) {
  const [tabName, setTabName] = React.useState('Allsongs');
  const [songs, setSongs] = React.useState<SongList[]>(songsList.Allsongs);
  useEffect(() => {
    switch (tabName) {
      case 'Allsongs':
        setSongs(songsList.Allsongs);
        return;
      case 'Favourites':
        setSongs(songsList.Favourites);
        return;
      case 'Albums':
        setSongs(songsList.Albums);
        return;
      case 'Workouts':
        setSongs(songsList.Workouts);
        return;
    }
  }, [tabName]);
  return (
    <>
      <VStack
        flex={1}
        _light={{ bg: 'primary.50' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <DashboardLayout
          title={'Playlist'}
          displayScreenTitle={true}
          displayMenuButton
          rightPanelMobileHeader={true}
        >
          <Box
            flex={1}
            flexDirection={{ base: 'column', md: 'row' }}
            _light={{
              borderTopColor: 'coolGray.200',
            }}
            _dark={{
              bg: 'coolGray.700',
              borderTopColor: 'coolGray.700',
            }}
          >
            <VStack flex={1}>
              <Hidden from="md">
                <>
                  <ScrollView
                    _light={{ bg: 'white' }}
                    _dark={{ bg: 'coolGray.700' }}
                    flex={1}
                    stickyHeaderIndices={[1]}
                    bounces={false}
                  >
                    <MobileHeader />
                    <VStack flexGrow={1}>
                      <HStack
                        _light={{
                          bg: 'coolGray.100',
                        }}
                        _dark={{
                          bg: 'coolGray.700',
                        }}
                        w="100%"
                        justifyContent="space-between"
                        borderRadius="sm"
                      >
                        {tabs.map(({ id, title }) => (
                          <TabItem
                            key={id}
                            tabName={title}
                            currentTab={tabName}
                            handleTabChange={(tab) => setTabName(tab)}
                            px={{ base: '4' }}
                          />
                        ))}
                      </HStack>
                    </VStack>
                    <SongsList currentSongTab={songs} />
                  </ScrollView>
                  <MobileMinimizedSong />
                  <MobileFooter navigation={navigation} />
                </>
              </Hidden>
              <Hidden till="md">
                <>
                  <VStack maxW="1016" flex={1} width="100%" mx="auto">
                    <DesktopBanner />
                    <HStack
                      _light={{
                        bg: 'coolGray.100',
                      }}
                      _dark={{
                        bg: 'coolGray.700',
                      }}
                      w="100%"
                      justifyContent="space-between"
                      borderRadius="sm"
                    >
                      {tabs.map(({ id, title }) => (
                        <TabItem
                          key={id}
                          tabName={title}
                          currentTab={tabName}
                          handleTabChange={(tab) => setTabName(tab)}
                          px={{ base: '4', md: '4', lg: '10' }}
                        />
                      ))}
                    </HStack>
                    <SongsList currentSongTab={songs} />
                  </VStack>
                </>
              </Hidden>
            </VStack>
          </Box>
        </DashboardLayout>
        <Hidden till="md">
          <DesktopMinimizedSong />
        </Hidden>
      </VStack>
    </>
  );
}
export default function () {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <StackNavigator.Screen name="Home" component={PlaylistScreen} />
        <StackNavigator.Screen name="Podcast" component={PlaylistScreen} />
        <StackNavigator.Screen name="Search" component={PlaylistScreen} />
        <StackNavigator.Screen name="My library" component={PlaylistScreen} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
