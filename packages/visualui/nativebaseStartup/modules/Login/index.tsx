import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SplashScreen from './Splash';
import CreatePassword from './CreatePassword';
import ForgotPassword from './ForgotPassword';
import OtpVerification from './OtpVerification';

storiesOf('Login', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('SplashScreen', () => <SplashScreen />)
  .add('SignUp', () => <SignUp />)
  .add('SignIn', () => <SignIn />)
  .add('ForgotPassword', () => <ForgotPassword />)
  .add('OtpVerification', () => <OtpVerification />)
  .add('CreatePassword', () => <CreatePassword />);
