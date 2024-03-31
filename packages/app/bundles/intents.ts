import {IntentType} from 'protolib'
import {processFilesIntent} from 'protolib/bundles/files/intents'
import { useMemo } from 'react';

export const useIntent = (intent: IntentType) => {
    //add your intents here
    return processFilesIntent(intent)
}