import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import ManageAddress from './ManageAddress';
import DeliveryMethod from './DeliveryMethod';
import WeatherDisplay from './WeatherDisplay';
import StoreLocatorTwo from './StoreLocatorTwo';
import StoreLocator from './StoreLocator';
import AutoDetectLocation from './AutoDetectLocation';
import TrainTracking from './TrainTracking';
import TrackingOne from './TrackingOne';
import TrackingTwo from './TrackingTwo';
import TrackingThree from './TrackingThree';

import TrackingFour from './TrackingFour';
storiesOf('MapsAndAddress', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('ManageAddress', () => <ManageAddress />)
  .add('DeliveryMethod', () => <DeliveryMethod />)
  .add('TrainTracking', () => <TrainTracking />)
  .add('StoreLocatorOne', () => <StoreLocator />)
  .add('StoreLocatorTwo', () => <StoreLocatorTwo />)
  .add('WeatherDisplay', () => <WeatherDisplay />)
  .add('TrackingOne', () => <TrackingOne />)
  .add('TrackingTwo', () => <TrackingTwo />)
  .add('TrackingThree', () => <TrackingThree />)
  .add('TrackingFour', () => <TrackingFour />)
  .add('AutoDetectLocation', () => <AutoDetectLocation />);
