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

transferExtensionComponents()


const app = getApp(AppConfig, {disablePreviewMode: true})
export default app
