import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';

import Cart from './Cart';
import TrackOrders from './TrackOrders';
import MyOrders from '../Catalog/MyOrders';
import DeliveryDetails from './DeliveryDetails';
import ProductCatalog from './ProductCatalog';
import ReturnOrder from './ReturnOrder';
import Wishlist from './Wishlist';
import Refund from './Refund';
import RequestCancellation from './RequestCancellation';
import RequestCancellationMultipleProducts from './RequestCancellationMultipleProducts';
import RequestCancellationMultipleProductsSuccess from './RequestCancellationMultipleProductsSuccess';

import PhotoLibraryOne from './PhotoLibraryOne';
storiesOf('Catalog', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('ProductCatalog', () => <ProductCatalog />)
  .add('TrackOrders', () => <TrackOrders />)
  .add('RefundOrder', () => <Refund />)
  .add('ReturnOrder', () => <ReturnOrder />)
  .add('MyCart', () => <Cart />)
  .add('DeliveryDetails', () => <DeliveryDetails />)
  .add('RequestCancellation', () => <RequestCancellation />)
  .add('PhotoLibrary', () => <PhotoLibraryOne />)
  .add('RequestCancellationMultipleProducts', () => (
    <RequestCancellationMultipleProducts />
  ))
  .add('MyWishlist', () => <Wishlist />)
  .add('CancellationSuccessful', () => (
    <RequestCancellationMultipleProductsSuccess />
  ))
  .add('MyOrders', () => <MyOrders />);
