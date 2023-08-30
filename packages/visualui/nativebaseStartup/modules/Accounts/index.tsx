import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import EditAccount from './EditAccount';
import DeleteAccount from './DeleteAccount';
import ManageAccount from './ManageAccount';
import LinkedAccounts from './LinkedAccounts';
import ContactDetails from './ContactDetails';
import AccountSettings from './AccountSettings';

import DeactivateAccount from './DeactivateAccount';
import ContactList from './ContactList';
import EditProfilePicture from './EditProfilePicture';

storiesOf('Accounts', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('AccountSettings', () => <AccountSettings />)
  .add('ManageAccounts', () => <ManageAccount />)
  .add('ContactDetails', () => <ContactDetails />)
  .add('DeleteAccount', () => <DeleteAccount />)
  .add('LinkedAccounts', () => <LinkedAccounts />)
  .add('DeactivateAccount', () => <DeactivateAccount />)
  .add('EditDetails', () => <EditAccount />)
  .add('EditProfilePicture', () => <EditProfilePicture />)
  .add('ContactList', () => <ContactList />);
