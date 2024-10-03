import React from 'react';
import { filterCallback, restoreCallback } from 'protoflow';
import onEventMask from './OnEventMask'
import onDeviceEventMask from './OnDeviceEventMask'
import EmitEvent from './EmitEvent';
import GetLastEvent from './GetLastEvent';

export default {
    api: [ onEventMask, onDeviceEventMask, EmitEvent, GetLastEvent ]
}