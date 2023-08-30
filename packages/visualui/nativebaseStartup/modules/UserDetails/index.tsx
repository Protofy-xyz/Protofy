import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import UserProfileScreen from './UserProfileScreen';
import QRCode from './QRCode';
import SellerDetailPage from '../UserDetails/SellerDetailPage';

import TutorProfile from '../UserDetails/Tutorprofile';
import TutorSyllabus from './TutorSyllabus';
storiesOf('UserDetails', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('ProfileScreen', () => <UserProfileScreen />)
  .add('SellerDetails', () => <SellerDetailPage />)
  .add('TutorProfile', () => <TutorProfile />)
  .add('QRCode', () => <QRCode />)
  .add('TutorSyllabus', () => <TutorSyllabus />);
