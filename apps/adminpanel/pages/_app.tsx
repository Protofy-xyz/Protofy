import { setConfig, initSchemaSystem } from 'protobase';
import { getBaseConfig } from '@my/config'
setConfig(getBaseConfig("next", process))
import { AppConfig } from '../conf'
import getApp from 'app/features/app'
import { transferExtensionComponents } from 'app/bundles/sharedComponents';

initSchemaSystem()

if (process.env.NODE_ENV === 'production') {
  require('../../../data/public/themes/adminpanel.css')
}

// This is a hack to make react available in the boards html
// ---------------------------------------------------------
import React from 'react';
import * as ReactDOM from 'react-dom/client';

if (typeof window !== 'undefined') {
  // Exponer React y ReactDOM en window para usar en scripts externos o Babel
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}

// components to expose to the app
import { Button, Text, View } from 'tamagui';
import { Provider } from 'app/provider'
import { Tinted } from 'protolib/components/Tinted'; 
import { DataView} from 'protolib/components/DataView';
import { ObjectViewLoader } from 'protolib/components/ObjectViewLoader';
import { MqttWrapper } from 'protolib/components/MqttWrapper';
import { API, ProtoModel } from 'protobase'
import { TransferComponent } from 'protolib/lib/transferComponent';

transferExtensionComponents()
TransferComponent(Button, 'Button');
TransferComponent(Text, 'Text');
TransferComponent(View, 'View');
TransferComponent(Provider, 'Provider');
TransferComponent(Tinted, 'Tinted');
TransferComponent(DataView, 'ProtoDataView');
TransferComponent(ObjectViewLoader, 'ObjectViewLoader');
TransferComponent(API, 'API');
TransferComponent(ProtoModel, 'ProtoModel');
TransferComponent(MqttWrapper, 'MqttWrapper');

const app = getApp(AppConfig, {disablePreviewMode: true})
export default app
