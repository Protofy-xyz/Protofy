import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import Wrapper from '../../Wrapper';
import Emi from './Emi';
import Wallet from './Wallet';
import UpiPayment from './UpiPayment';
import PaymentMethodOptions from './PaymentMethodOptions';
import UpiPay from './UpiPay';
import CardPayment from './CardPayment';
import BalanceCheck from './BalanceCheck';
import UpiPaymentsOne from './UpiPaymentsOne';
import BalanceCheckTwo from './BalanceCheckTwo';
import OrderConfirmation from './OrderConfirmation';
import ConfirmationOrder from './ConfirmationOrder';

storiesOf('Payment', module)
  .addDecorator(withKnobs)
  .addDecorator((getStory) => <Wrapper>{getStory()}</Wrapper>)
  .add('Wallet', () => <Wallet />)
  .add('EmiDetails', () => <Emi />)
  .add('BalanceCheck', () => <BalanceCheck />)
  .add('UpiPay', () => <UpiPay />)
  .add('UpiPaymentsOne', () => <UpiPaymentsOne />)
  .add('OrderConfirmation', () => <OrderConfirmation />)
  .add('BalanceCheckTwo', () => <BalanceCheckTwo />)
  .add('PaymentMethodOptions', () => <PaymentMethodOptions />)
  .add('CardPayment', () => <CardPayment />)
  .add('UpiPayment', () => <UpiPayment />);
// .add('ConfirmationOrder', () => <ConfirmationOrder />)
