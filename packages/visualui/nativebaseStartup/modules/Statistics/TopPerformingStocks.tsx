import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Divider,
  Hidden,
  ScrollView,
  Pressable,
  Link,
} from 'native-base';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBar from '../../components/TabBar';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';

const Stack = createStackNavigator();

const Gainers = () => <TopGainers />;

const Losers = () => <TopGainers />;

const Value = () => <TopGainers />;

const renderScene = SceneMap({
  Gainers: Gainers,
  Losers: Losers,
  Value: Value,
});
type StockProps = {
  companyName: string;
  negativeValue: boolean;
  nse: string;
  value: string;
  vol: string;
  change: string;
  changePercentage: string;
};
const stocks: StockProps[] = [
  {
    companyName: 'Reliance',
    negativeValue: false,
    nse: 'NSE : Jul 06,11:44',
    value: '1700.37',
    vol: 'Vol:5.53m',
    change: '170.37',
    changePercentage: '+9.12%',
  },
  {
    companyName: 'Tata Motors',
    nse: 'NSE : Jul 06,11:44',
    value: '1410.37',
    negativeValue: false,
    vol: 'Vol:5.53m',
    change: '78.37',
    changePercentage: '+4.12%',
  },
  {
    companyName: 'UPL',
    negativeValue: true,
    nse: 'NSE : Jul 06,11:44',
    value: '410.37',
    vol: 'Vol:5.53m',
    change: '18.37',
    changePercentage: '-3.12%',
  },
  {
    companyName: 'Reliance Power',
    negativeValue: false,
    nse: 'NSE : Jul 06,11:44',
    value: '210.37',
    vol: 'Vol:5.53m',
    change: '12.37',
    changePercentage: '+2.12%',
  },
  {
    companyName: 'SBI',
    negativeValue: true,
    nse: 'NSE : Jul 06,11:44',
    value: '610.37',
    vol: 'Vol:5.53m',
    change: '15.37',
    changePercentage: '-8.12%',
  },
  {
    companyName: 'RBL',
    negativeValue: true,
    nse: 'NSE : Jul 06,11:44',
    value: '414.37',
    vol: 'Vol:5.53m',
    change: '16.37',
    changePercentage: '-1.12%',
  },
  {
    companyName: 'Canara',
    negativeValue: false,
    nse: 'NSE : Jul 06,11:44',
    value: '219.37',
    vol: 'Vol:5.53m',
    change: '18.37',
    changePercentage: '+23.12%',
  },
  {
    companyName: 'Bajaj Finance',
    negativeValue: false,
    nse: 'NSE : Jul 06,11:44',
    value: '110.37',
    vol: 'Vol:5.53m',
    change: '20.37',
    changePercentage: '+2.12%',
  },
];

const StocksPerformance = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Gainers', title: 'Top Gainers' },
    { key: 'Losers', title: 'Top Losers' },
    { key: 'Value', title: 'Active by value' },
  ]);
  return (
    <Box w="100%" h="100%">
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar {...props} variant="secondary" px="2" />
        )}
      />
    </Box>
  );
};

function TableHeader() {
  return (
    <Box
      pt="4"
      pb="3"
      px={{ base: 4, md: 8 }}
      _light={{ bg: 'white' }}
      _dark={{ bg: 'coolGray.800' }}
    >
      <HStack>
        <HStack space="0.5" flex={1}>
          <Text
            _light={{ color: 'primary.900' }}
            _dark={{ color: 'coolGray.50' }}
            fontSize="sm"
            fontWeight="medium"
          >
            Today
          </Text>
          <Icon
            as={MaterialIcons}
            name={'keyboard-arrow-down'}
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.50' }}
            size="6"
          />
        </HStack>
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontSize="sm"
          flex={1}
          textAlign="center"
        >
          Value
        </Text>
        <Text
          _light={{ color: 'coolGray.800' }}
          _dark={{ color: 'coolGray.50' }}
          fontSize="sm"
          flex={1}
          textAlign="right"
        >
          Change(%)
        </Text>
      </HStack>
    </Box>
  );
}

function Card(props: StockProps) {
  return (
    <HStack px={{ base: 4, md: 8 }}>
      <VStack space="1" flex={1}>
        <Link
          href=""
          isUnderlined={false}
          _text={{
            _light: { color: 'coolGray.800' },
            _dark: { color: 'coolGray.50' },
            fontWeight: 'medium',
            fontSize: 'sm',
          }}
        >
          {props.companyName}
        </Link>
        <Text
          fontSize="sm"
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
        >
          {props.nse}
        </Text>
      </VStack>

      <VStack space="1" flex={1} alignItems="center">
        <Text
          fontSize="sm"
          _light={{
            color: props.negativeValue ? 'red.600' : 'green.600',
          }}
          _dark={{
            color: props.negativeValue ? 'red.400' : 'green.400',
          }}
        >
          {props.value}
        </Text>
        <Text
          fontSize="sm"
          _light={{
            color: 'coolGray.500',
          }}
          _dark={{
            color: 'coolGray.400',
          }}
        >
          {props.vol}
        </Text>
      </VStack>
      <VStack space="1" flex={1} alignItems="flex-end">
        <Text
          fontSize="sm"
          _light={{
            color: props.negativeValue ? 'red.600' : 'green.600',
          }}
          _dark={{
            color: props.negativeValue ? 'red.400' : 'green.400',
          }}
        >
          {props.change}
        </Text>
        <Text
          fontSize="sm"
          _light={{
            color: props.negativeValue ? 'red.600' : 'green.600',
          }}
          _dark={{
            color: props.negativeValue ? 'red.400' : 'green.400',
          }}
        >
          {props.changePercentage}
        </Text>
      </VStack>
    </HStack>
  );
}
function TopGainers() {
  return (
    <ScrollView>
      <TableHeader />
      <VStack divider={<Divider />} space="4" pt="2" pb={{ base: 4, md: 0 }}>
        {stocks.map((stock, index) => {
          return <Card key={index} {...stock} />;
        })}
      </VStack>
    </ScrollView>
  );
}

type Icon = {
  iconName: string;
  iconText: string;
};
const footerIcons: Icon[] = [
  { iconName: 'list', iconText: 'Watchlist' },
  { iconName: 'timer', iconText: 'Orders' },
  { iconName: 'insights', iconText: 'Portfolio' },
  { iconName: 'rupee', iconText: 'Funds' },
];
function MobileFooter({ navigation }: { navigation: any }) {
  const route = useRoute();
  return (
    <Hidden from="md">
      <HStack
        justifyContent="space-between"
        h="20"
        px="30"
        py="18"
        width="100%"
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        overflow="hidden"
        alignItems="center"
        borderTopWidth="1"
        _light={{ backgroundColor: 'white', borderColor: 'coolGray.200' }}
        _dark={{ backgroundColor: 'coolGray.800', borderColor: 'coolGray.700' }}
      >
        {footerIcons.map((item, index) => {
          return (
            <Box key={index}>
              <Pressable
                alignItems="center"
                onPress={() => navigation.navigate(item.iconText)}
              >
                {item.iconName === 'rupee' ? (
                  <Icon
                    as={FontAwesome}
                    name={item.iconName}
                    size="6"
                    ml="2"
                    _light={{
                      color:
                        item.iconText === route.name
                          ? 'primary.900'
                          : 'coolGray.400',
                    }}
                    _dark={{
                      color:
                        item.iconText === route.name
                          ? 'primary.500'
                          : 'coolGray.400',
                    }}
                  />
                ) : (
                  <Icon
                    as={MaterialIcons}
                    name={item.iconName}
                    size="6"
                    _light={{
                      color:
                        item.iconText === route.name
                          ? 'primary.900'
                          : 'coolGray.400',
                    }}
                    _dark={{
                      color:
                        item.iconText === route.name
                          ? 'primary.500'
                          : 'coolGray.400',
                    }}
                  />
                )}
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  mt="0.5"
                  _light={{
                    color:
                      item.iconText === route.name
                        ? 'primary.900'
                        : 'coolGray.500',
                  }}
                  _dark={{
                    color:
                      item.iconText === route.name
                        ? 'primary.500'
                        : 'coolGray.400',
                  }}
                >
                  {item.iconText}
                </Text>
              </Pressable>
            </Box>
          );
        })}
      </HStack>
    </Hidden>
  );
}

function MainContent({ navigation }: { navigation: any }) {
  return (
    <>
      <Box
        pb="4"
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
        mb={{ base: 16, md: 0 }}
        borderRadius={{ md: 'sm' }}
        overflow="hidden"
        flex={1}
      >
        <StocksPerformance />
      </Box>
      <MobileFooter navigation={navigation} />
    </>
  );
}

function TopPerformingStocks({ navigation }: { navigation: any }) {
  return (
    <DashboardLayout title={'Dashboard'} rightPanelMobileHeader>
      <MainContent navigation={navigation} />
    </DashboardLayout>
  );
}

export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Watchlist" component={TopPerformingStocks} />
        <Stack.Screen name="Orders" component={TopPerformingStocks} />
        <Stack.Screen name="Portfolio" component={TopPerformingStocks} />
        <Stack.Screen name="Funds" component={TopPerformingStocks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
