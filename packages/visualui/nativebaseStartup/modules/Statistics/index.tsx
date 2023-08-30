import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import PortFolioOverview from './PortFolioOverview';
import InsuranceScreen from './InsuranceScreen';
import TopPerformingStocks from './TopPerformingStocks';
import Donations from '../Statistics/Donations';
import CampaignDetails from '../Statistics/CampaignDetails';

storiesOf('Statistics', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('PortfolioOverview', () => <PortFolioOverview />)
  .add('InsuranceDashboard', () => <InsuranceScreen />)
  .add('CampaignDetails', () => <CampaignDetails />)
  .add('Donations', () => <Donations />)
  .add('TopPerformingStocks', () => <TopPerformingStocks />);
