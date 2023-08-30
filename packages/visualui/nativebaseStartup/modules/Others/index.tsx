import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import Archived from './Archived';
import BluetoothPairing from './BluetoothPairing';
import AppUpdate from './AppUpdate';
import ChooseImage from './ChooseImage';
import PhotoFilters from './PhotoFilters';
import Restaurants from './Restaurant';
import SeatSelection from './SeatSelection';

// import Dashboard from './DashBoard';
// @ts-ignore

storiesOf('Others', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('AppUpdate', () => <AppUpdate />)
  .add('BluetoothPairing', () => <BluetoothPairing />)
  .add('Archived', () => <Archived />)
  .add('ChooseImage', () => <ChooseImage />)
  .add('PhotoFilters', () => <PhotoFilters />)
  .add('Restaurant', () => <Restaurants />)
  .add('SeatSelection', () => <SeatSelection />);
