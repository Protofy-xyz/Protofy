import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import LanguageTranslation from './LanguageTranslations';
import TermsAndCondition from './TermsAndCondition';
import PrivacySettings from './PrivacySettings';
import General from './General';
storiesOf('Setting', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('PrivacySettings', () => <PrivacySettings />)
  .add('TermsAndCondition', () => <TermsAndCondition />)
  .add('Language', () => <LanguageTranslation />)
  .add('GeneralSettings', () => <General />);
