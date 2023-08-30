import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import RateUs from './RateUs';
import HomeScreen from './HomeScreen';
//import EmptyPlaylist from './EmptyPlaylist';
import NoInternet from './NoInternet';
import SideNavigationDrawer from './SideNavigationDrawer';
import Gallery from './Gallery';
import Logout from './Logout';

storiesOf('HomeAndMenu', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('HomeScreen', () => <HomeScreen />)
  .add('Logout', () => <Logout />)
  .add('NoInternet', () => <NoInternet />)
  .add('RateUs', () => <RateUs />)
  .add('SideNavigationDrawer', () => <SideNavigationDrawer />)
  .add('Gallery', () => <Gallery />);
