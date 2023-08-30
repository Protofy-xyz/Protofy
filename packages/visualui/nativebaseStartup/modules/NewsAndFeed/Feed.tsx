import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  IconButton,
  ScrollView,
  Pressable,
  Link,
  Hidden,
  Button,
  Divider,
  FlatList,
  Card,
  IIconButtonProps,
} from 'native-base';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Carousel } from '../../components/Carousel';

type UserProfileProps = {
  userId: string | number;
  userName: string;
  userImage?: ImageSourcePropType;
  likedPosts?: UserPostProps[];
  commentedPosts?: UserPostProps[];
  userLocation?: string;
};

type CommentProps = {
  commentId: string | number;
  commentContent: string;
  user: UserProfileProps;
};

type UserPostProps = {
  postId: string | number;
  postCaption?: string;
  user: UserProfileProps;
  postImageUrls: ImageSourcePropType[];
  postLikes: UserProfileProps[];
  postComments: CommentProps[];
  timeStamp: string;
};

type NavigationItemProps = {
  iconName: string;
  iconText: string;
};

type StoryProps = {
  image: ImageSourcePropType;
  text: string;
};

const userProfiles: UserProfileProps[] = [
  {
    userId: '1',
    userName: 'Jerome watson',
    userImage: require('./images/NewsFeed7.png'),
    likedPosts: [],
    commentedPosts: [],
    userLocation: 'Toronto, CA',
  },
  {
    userId: '2',
    userName: 'Floyd Miles',
    userImage: require('./images/NewsFeed6.png'),
    likedPosts: [],
    commentedPosts: [],
    userLocation: 'California',
  },
  {
    userId: '3',
    userName: 'Theresa Webb',
    userImage: require('./images/NewsFeed11.png'),
    likedPosts: [],
    commentedPosts: [],
    userLocation: 'South Dakota',
  },
  {
    userId: '4',
    userName: 'John11',
    userImage: require('./images/NewsFeed10.png'),
    likedPosts: [],
    commentedPosts: [],
    userLocation: 'New Jersey 45463',
  },
];

const currentLoggedInUser: UserProfileProps = userProfiles[3];

const userPosts: UserPostProps[] = [
  {
    postId: '1',
    postCaption: 'First Day At Office. Excited!',
    user: userProfiles[0],
    postImageUrls: [
      require('./images/NewsFeed1.png'),
      require('./images/NewsFeed2.png'),
      require('./images/NewsFeed7.png'),
      require('./images/NewsFeed4.png'),
    ],
    postLikes: [userProfiles[0]],
    postComments: [
      {
        commentId: '1',
        commentContent: 'Pretty ',
        user: userProfiles[0],
      },
    ],
    timeStamp: '3 hours ago',
  },
  {
    postId: '2',
    postCaption: 'Good Hair!',
    user: userProfiles[1],
    postImageUrls: [
      require('./images/NewsFeed7.png'),
      require('./images/NewsFeed4.png'),
    ],
    postLikes: [userProfiles[0], userProfiles[2]],
    postComments: [
      {
        commentId: '1',
        commentContent: 'Pretty',
        user: userProfiles[0],
      },
      {
        commentId: '2',
        commentContent: 'Nice photo',
        user: userProfiles[1],
      },
      {
        commentId: '3',
        commentContent: 'Awesome',
        user: userProfiles[2],
      },
    ],
    timeStamp: '5 hours ago',
  },
];

const navigationItems: NavigationItemProps[] = [
  { iconName: 'home', iconText: 'Home' },
  { iconName: 'live-tv', iconText: 'IGTV' },
  { iconName: 'search', iconText: 'Search' },
  { iconName: 'chat', iconText: 'Chat' },
  { iconName: 'person', iconText: 'Profile' },
];

const storyImage: StoryProps[] = [
  {
    image: require('./images/NewsFeed9.png'),
    text: 'Your Story',
  },
  {
    image: require('./images/NewsFeed5.png'),
    text: 'Robert Fox',
  },
  {
    image: require('./images/NewsFeed2.png'),
    text: 'Floyd Miles',
  },
  {
    image: require('./images/NewsFeed6.png'),
    text: 'Kristin',
  },
  {
    image: require('./images/NewsFeed4.png'),
    text: 'Jane Cooper',
  },
  {
    image: require('./images/NewsFeed3.png'),
    text: 'Savannah',
  },
  {
    image: require('./images/NewsFeed4.png'),
    text: 'Devon Lane',
  },
  {
    image: require('./images/NewsFeed9.png'),
    text: 'Eleanor',
  },
  {
    image: require('./images/NewsFeed1.png'),
    text: 'Eleanor',
  },
  {
    image: require('./images/NewsFeed3.png'),
    text: 'Savannah',
  },
  {
    image: require('./images/NewsFeed4.png'),
    text: 'Devon Lane',
  },
  {
    image: require('./images/NewsFeed9.png'),
    text: 'Eleanor',
  },
  {
    image: require('./images/NewsFeed1.png'),
    text: 'Eleanor',
  },
];

const postActionIcons: IIconButtonProps[] = [
  {
    name: 'favorite-border',
    as: MaterialIcons,
    onPress: () => console.log('like button clicked'),
  },
  {
    name: 'message-circle',
    as: Feather,
    onPress: () => console.log('comment button pressed'),
  },
  {
    name: 'paper-plane-outline',
    as: Ionicons,
    pt: 1,
    onPress: () => console.log('share button pressed'),
  },
];

const suggestedProfileList: UserProfileProps[] = userProfiles.slice(0, 3);

/**
 * @param {StoryProps[]} storiesData - List of all stories
 * @returns Stories list component
 */
function Stories({ storiesData }: { storiesData: StoryProps[] }) {
  /**
   *
   * @param {StoryProps} story - Story object
   * @returns Story component
   */
  const Story = ({ story }: { story: StoryProps }) => (
    <HStack pl={{ base: 4, md: 4 }} flex={1} justifyContent="space-evenly">
      <VStack space={1} alignItems="center">
        <Pressable
          p={0}
          onPress={() => console.log(`Opened story of ${story.text}`)}
        >
          <Avatar
            width="16"
            height="16"
            borderWidth="2"
            p={0.5}
            source={story.image}
            borderColor="red.500"
            bg="transparent"
          />
        </Pressable>
        <Text fontSize="xs" fontWeight="normal">
          {story.text}
        </Text>
      </VStack>
    </HStack>
  );

  return (
    <Card rounded={{ md: 'sm' }}>
      <VStack width="100%" py={{ base: 4, md: 4 }} space={{ base: 1 }}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={storiesData}
          renderItem={({ item, index }) => (
            <Story key={`story-${index}`} story={item} />
          )}
        />
      </VStack>
    </Card>
  );
}

/**
 *
 * @param {ImageSourcePropType[]} images - list of images to show in carousel
 * @returns CarouselLayout component
 */
function CarouselLayout({ images }: { images: ImageSourcePropType[] }) {
  return (
    <Box
      mt={{ base: 4, md: 4 }}
      bg={{ base: 'transparent', md: 'transparent' }}
    >
      <Carousel
        images={images}
        height={{ base: 72 }}
        activeIndicatorBgColor="primary.700"
        inactiveIndicatorBgColor="coolGray.300"
      />
    </Box>
  );
}

/**
 * @param {UserPostProps[]} postsData - List of all posts
 * @returns Posts list component
 */
function PostList({ postsData }: { postsData: UserPostProps[] }) {
  /**
   *
   * @param {UserPostProps} post - Post object
   * @param {IIconButtonProps[]} postActionsIcons - post action icons i.e like, comment, share
   * @returns
   */
  const Post = ({
    post,
    postActionsIcons,
  }: {
    post: UserPostProps;
    postActionsIcons: IIconButtonProps[];
  }) => {
    return (
      <Card
        flexDirection="column"
        pt={{ base: 7, md: 4 }}
        pb={{ base: 8, md: 4 }}
        mt={{ md: 3 }}
        rounded={{ md: 'sm' }}
      >
        <HStack justifyContent="space-between">
          <HStack space={2} alignItems="center" px="4">
            <Avatar
              borderWidth="1"
              _light={{ borderColor: 'primary.900' }}
              _dark={{ borderColor: 'primary.700' }}
              source={post.user.userImage}
              width="8"
              height="8"
            />
            <VStack>
              <Pressable
                onPress={() => {
                  console.log(`${post.user.userName} clicked`);
                }}
              >
                <Text fontSize="sm" fontWeight="semibold">
                  {post.user.userName}
                </Text>
              </Pressable>

              <Text
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.300' }}
                fontSize="xs"
              >
                {post.user.userLocation}
              </Text>
            </VStack>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name={'more-vert'}
                _light={{ color: 'coolGray.800' }}
                _dark={{ color: 'coolGray.50' }}
              />
            }
            onPress={() => {
              console.log('here you will have more options regarding the post');
            }}
          />
        </HStack>
        <CarouselLayout images={post.postImageUrls} />

        <HStack
          alignItems="center"
          space={3}
          pl="4"
          position="absolute"
          left={0}
          top={{ base: '384', md: '370' }}
        >
          {postActionsIcons.map(
            ({ name, as, ...props }: IIconButtonProps, index) => {
              return (
                <IconButton
                  key={index}
                  p="0"
                  icon={
                    <Icon
                      key={`${name}-${index}`}
                      size="6"
                      as={as}
                      name={name}
                      color="coolGray.400"
                    />
                  }
                  {...props}
                />
              );
            }
          )}
        </HStack>
        <Text
          fontSize="xs"
          fontWeight="normal"
          color="coolGray.400"
          alignSelf="flex-end"
          pr="4"
          position="absolute"
          right={0}
          top={{ base: '384', md: '370' }}
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          {post.timeStamp}
        </Text>

        <VStack px="4" space={1} pt={6}>
          <HStack alignItems="center" space={1}>
            <Text fontSize="xs" fontWeight="normal">
              Liked by
            </Text>
            <Link
              href="https://nativebase.io"
              _text={{
                textDecorationLine: 'none',
                fontSize: 'sm',
                fontWeight: 'medium',
                _light: { color: 'coolGray.800' },
                _dark: { color: 'coolGray.50' },
              }}
            >
              {post?.postLikes[0]?.userName}
            </Link>
            {post.postLikes.length - 1 > 0 && (
              <Text fontSize="xs" fontWeight="normal">
                and
              </Text>
            )}
            {post.postLikes.length - 1 > 0 && (
              <Link
                href="https://nativebase.io"
                _text={{
                  textDecorationLine: 'none',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  _light: { color: 'coolGray.800' },
                  _dark: { color: 'coolGray.50' },
                }}
              >
                {`${`${post.postLikes?.length - 1}`} others`}
              </Link>
            )}
          </HStack>
          <HStack alignItems="center" space={3}>
            <Link
              href="https://nativebase.io"
              _text={{
                textDecorationLine: 'none',
                fontSize: 'sm',
                fontWeight: 'medium',
                _light: { color: 'coolGray.800' },
                _dark: { color: 'coolGray.50' },
              }}
            >
              {`${post.user.userName}`}
            </Link>
            <Text fontSize="sm" fontWeight="normal">
              {`${post.postCaption}`}
            </Text>
          </HStack>
          <Pressable
            onPress={() => {
              console.log('Clicked on comment');
            }}
          >
            {post.postComments.length > 1 && (
              <Text
                fontSize="sm"
                fontWeight="normal"
                _light={{ color: 'coolGray.500' }}
                _dark={{ color: 'coolGray.400' }}
              >
                {`View all ${post.postComments?.length} comments`}
              </Text>
            )}
          </Pressable>
          <HStack space={3} alignItems="center">
            <Text fontSize="sm" fontWeight="medium">
              {post.postComments[0].user.userName}
            </Text>
            <Text fontSize="sm" fontWeight="normal">
              {post.postComments[0].commentContent}
            </Text>
          </HStack>
        </VStack>
      </Card>
    );
  };

  return (
    <FlatList
      data={postsData}
      renderItem={({ item, index }) => (
        <Post postActionsIcons={postActionIcons} key={index} post={item} />
      )}
    />
  );
}

function SidePanel() {
  /**
   *
   * @param {UserProfileProps} user of - CurrentLoggedIn user
   * @returns Account component
   */
  const Account = ({ user }: { user: UserProfileProps }) => (
    <HStack space={3} alignItems="center">
      <Avatar size="16" source={user.userImage} />
      <VStack>
        <Text fontSize="md" fontWeight="medium">
          {user.userName}
        </Text>
        <Text fontSize="sm" fontWeight="normal">
          {user.userLocation}
        </Text>
      </VStack>
      <Link
        ml="auto"
        _text={{
          _light: { color: 'primary.900' },
          _dark: { color: 'primary.500' },
          textDecorationLine: 'none',
          fontWeight: 'medium',
        }}
      >
        Switch
      </Link>
    </HStack>
  );

  /**
   *
   * @param {UserProfileProps} user - Suggested user profile
   * @returns SuggestedProfile component
   */
  const SuggestedProfile = ({ user }: { user: UserProfileProps }) => (
    <HStack alignItems="center" justifyContent="space-between">
      <Pressable
        onPress={() => {
          console.log(`${user.userName} clicked`);
        }}
      >
        <HStack space={2} alignItems="center" mt={6}>
          <Avatar size={9} source={user.userImage} />
          <VStack>
            <Text fontWeight="medium" fontSize="sm">
              {user.userName}
            </Text>
            <Text fontWeight="normal" fontSize="xs">
              {user.userLocation}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
      <Link
        mt={2}
        _text={{
          textDecorationLine: 'none',
          fontSize: 'sm',
          fontWeight: 'medium',
          _light: { color: 'coolGray.500' },
          _dark: { color: 'coolGray.400' },
        }}
      >
        Follow
      </Link>
    </HStack>
  );

  /**
   *
   * @param {UserProfileProps[]} suggestedProfilesList - List of suggested profiles
   */
  const SuggestedProfilesList = ({
    suggestedProfilesList,
  }: {
    suggestedProfilesList: UserProfileProps[];
  }) => (
    <FlatList
      data={suggestedProfilesList}
      renderItem={({ item, index }) => (
        <SuggestedProfile user={item} key={index} />
      )}
    />
  );

  return (
    <VStack w="340px" px={{ md: 6 }} borderRadius={{ md: 8 }}>
      <Account user={currentLoggedInUser} />
      <HStack justifyContent="space-between" alignItems="center" mt={10}>
        <Text fontSize="sm" fontWeight="bold">
          Suggestions for you
        </Text>
        <Link
          _text={{
            fontWeight: 'medium',
            fontSize: 'sm',
            textDecorationLine: 'none',
            _light: { color: 'primary.900' },
            _dark: { color: 'primary.500' },
          }}
        >
          See All
        </Link>
      </HStack>
      <SuggestedProfilesList suggestedProfilesList={suggestedProfileList} />
    </VStack>
  );
}

/**
 *
 * @param {NavigationItemProps[]} bottomNavigationItems - List of bottom navigation items
 * @returns BottomNavigation component
 */
function BottomNavigation({
  bottomNavigationItems,
}: {
  bottomNavigationItems: NavigationItemProps[];
}) {
  const BottomNavigationItem = ({
    navigationItem,
    activeItem,
  }: {
    navigationItem: NavigationItemProps;
    activeItem: number;
  }) => (
    <Button
      variant="ghost"
      colorScheme="coolGray"
      _stack={{
        flexDirection: 'column',
      }}
      startIcon={
        <Icon
          as={MaterialIcons}
          name={navigationItem.iconName}
          size="5"
          _light={{
            color: activeItem === 0 ? 'primary.900' : 'coolGray.400',
          }}
          _dark={{
            color: activeItem === 0 ? 'primary.500' : 'coolGray.400',
          }}
        />
      }
      _text={{
        mt: '1',
        fontSize: 'xs',
        _light: {
          color: activeItem === 0 ? 'primary.900' : 'coolGray.400',
        },
        _dark: {
          color: activeItem === 0 ? 'primary.500' : 'coolGray.400',
        },
      }}
    >
      {navigationItem.iconText}
    </Button>
  );

  return (
    <Hidden from="md">
      <Card
        justifyContent="space-between"
        flexDirection="row"
        safeAreaBottom
        h="20"
        width="100%"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        overflow="hidden"
        alignSelf="center"
        borderTopLeftRadius="20"
        borderTopRightRadius="20"
      >
        {bottomNavigationItems.map((item, index) => {
          return (
            <BottomNavigationItem
              key={index}
              navigationItem={item}
              activeItem={index}
            />
          );
        })}
      </Card>
    </Hidden>
  );
}

export default function () {
  return (
    <>
      <DashboardLayout
        title="Welcome!"
        displayScreenTitle={false}
        displaySidebar={false}
      >
        <ScrollView>
          <HStack>
            <VStack flex={1} mb={{ base: 20, md: 0 }}>
              <Stories storiesData={storyImage} />
              <Hidden only={['lg', 'md', 'xl']}>
                <Divider />
              </Hidden>
              <PostList postsData={userPosts} />
            </VStack>
            <Hidden from="base" till="md">
              <VStack>
                <SidePanel />
              </VStack>
            </Hidden>
          </HStack>
        </ScrollView>
      </DashboardLayout>
      <BottomNavigation bottomNavigationItems={navigationItems} />
    </>
  );
}
