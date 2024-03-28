import React from 'react';
import { filterCallback, restoreCallback } from 'protoflow';
import onEventMask from './OnEventMask'
import onDeviceEventMask from './OnDeviceEventMask'

export default {
    api: [ onEventMask, onDeviceEventMask ]
}