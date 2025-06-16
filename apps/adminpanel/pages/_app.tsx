import { setConfig, initSchemaSystem } from 'protobase';
import { getBaseConfig } from '@my/config'
setConfig(getBaseConfig("next", process))
import { AppConfig } from '../conf'
import getApp from 'app/features/app'

initSchemaSystem()

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
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

// tamagui-globals.ts
import { Button, Text, View } from 'tamagui';
import { Provider } from 'app/provider'
import { Tinted } from 'protolib/components/Tinted'; 
import { DataView} from 'protolib/components/DataView';
import { ObjectViewLoader } from 'protolib/components/ObjectViewLoader';
import { MqttWrapper } from 'protolib/components/MqttWrapper';
import { API, ProtoModel } from 'protobase'

if (typeof window !== 'undefined') {
  window.TamaguiComponents = {
    Button,
    Text,
    View,
    Provider,
    Tinted,
    DataView,
    ObjectViewLoader,
    API,
    ProtoModel,
    MqttWrapper
  };
}
// ---------------------------------------------------------

const app = getApp(AppConfig, {disablePreviewMode: true})
export default app
