import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import ProductDetails from './ProductDetails';
import ReviewPage from './ReviewPage';
import FullScreenProductPage from './FullScreenProductPage';
import SizeChart from './SizeChart';

storiesOf('ProductDetail', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('ProductDetails', () => <ProductDetails />)
  .add('ReviewPage', () => <ReviewPage />)
  .add('FullPageProductScreen', () => <FullScreenProductPage />)
  .add('SizeChart', () => <SizeChart />);
