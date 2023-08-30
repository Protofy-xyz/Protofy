import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import SubscriptionPlan from './SubscriptionPlan';
import SubscriptionFeatures from './SubscriptionFeatures';
import ReferAndEarn from './ReferAndEarn';
import GiftCard from './GiftCard';
import Notification from './Notification';
import ReferAndEarn2 from './ReferAndEarn2';
import OfferPage from './OfferPage';
storiesOf('OffersAndPromotions', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('ReferAndEarn', () => <ReferAndEarn />)
  .add('ReferAndEarn2', () => <ReferAndEarn2 />)
  .add('SubscriptionPlan', () => <SubscriptionPlan />)
  .add('GiftCard', () => <GiftCard />)
  .add('SubscriptionFeatures', () => <SubscriptionFeatures />)
  .add('Notifications', () => <Notification />)
  .add('Offers', () => <OfferPage />);
